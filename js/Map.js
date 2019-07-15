const Node = require('./Node.js')
const Edge = require('./Edge.js')
const Tombola = require('./math/tombola')
import Single from './Single.js';
import BotSet from './State.js';
import { State } from 'pixi.js';
const intersects = require('intersects')
const lineIntersect = require('./math/line-intersect')
const _ = require('underscore')
const PIXI = require('pixi.js')


function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults)
}


class Map {
    constructor (stage) {
        this.nodes = new Set()
        this.bots = BotSet;
        this.nodeDeck = new Tombola().deck()
        this.stage = stage;
        this.edges = new Set()
        this.source = new Node(stage)
        this.nodes.add(this.source)
        this.nodeDeck.insert(this.source)
    }

    getIntersect(lineAStart, lineAEnd, lineBStart, lineBEnd) {
        let point = lineIntersect([[lineAStart.posX, lineAStart.posY], [lineAEnd.posX, lineAEnd.posY]],
            [[lineBStart.posX, lineBStart.posY], [lineBEnd.posX, lineBEnd.posY]])
        point = point.Right || point.Left
        return point
    }

    createIntermediateNode = (node, angle, edge) => {
        let newPosX = node.position.posX + Math.round(1000 * Math.cos(angle * Math.PI / 180))
        let newPosY = node.position.posY + Math.round(1000 * Math.sin(angle * Math.PI / 180))

        let positions = edge.getPositions()

        let point = this.getIntersect([node.position.posX, node.position.posY], [newPosX, newPosY],
            [positions[1].posX, positions[1].posY], [positions[0].posX, positions[0].posY])

        let a, b
        for (const n of edge.edgeNodes) {
            a = n
            break
        }
        b = edge.getDestination(a)
        // let line = this.drawLine({posX: node.position.posX, posY: node.position.posY}, {posX: newPosX, posY: newPosY}, angle, 0xe74c3c)
        // let line2 = this.drawLine({posX: positions[0].posX, posY: positions[0].posY}, {posX: positions[1].posX , posY: positions[1].posY}, edge.angle, 0xe74c3c)
        let newNode = new Node(this.stage, { posX: point[0], posY: point[1] })
        let newEdge = new Edge(this.stage, { connectingNodes: [newNode, b], animate: false, angle: edge.angle})
        this.nodes.add(newNode)
        this.edges.add(newEdge)
        // update current edge to end at new intermediate node
        edge.update(b, newNode)
        // add old edge as an edge of new node
        newNode.addEdge(edge)
        // add new edge as an edge of new node
        newNode.addEdge(newEdge)
        this.nodeDeck.insert(newNode)
        return newNode
    }

    extendEdge = (node, angle) => {
        let possibleEdges = this.testIntersection(node.position, angle, {returnIntersections: true, bufferDistance: 500 })
        let closestEdge = { distance: 10000, edge: null }
        let newPosX = node.position.posX + Math.round(1000 * Math.cos(angle * Math.PI / 180))
        let newPosY = node.position.posY + Math.round(1000 * Math.sin(angle * Math.PI / 180))
        for (const edge of possibleEdges) {
            let edgePositions = Array.from(edge.getPositions())
            let intersect = this.getIntersect(node.position, {posX: newPosX, posY: newPosY}, edgePositions[0], edgePositions[1])
            let dist = Math.hypot(intersect[0] - node.position.posX, intersect[1] - node.position.posY)
            if (dist < closestEdge.distance ) {
                closestEdge.edge = edge
                closestEdge.distance = dist
                console.log(closestEdge)
            }
        }
        if (possibleEdges.length != 0) {
            let newNode = this.createIntermediateNode(node, angle, closestEdge.edge)
            let newEdge = new Edge(this.stage, {connectingNodes: [node, newNode], angle: angle})
            this.edges.add(newEdge)
        }
    }

    testIntersection = (position, angle, options) => {
        let defaults = {
            returnIntersections: false,
            bufferWidth: 1,
            bufferDistance: 500
        }
        let intersections = []
        options = setDefaults(options, defaults)
        // console.log(position, angle, options)
        let offPosX = position.posX + Math.round((options.bufferWidth*2/3 + 5) * Math.cos(angle * Math.PI / 180))  // offset to avoid outgoing edges from current node
        let offPosY = position.posY + Math.round((options.bufferWidth*2/3 + 5) * Math.sin(angle * Math.PI / 180))
        let projPosX = position.posX + Math.round(options.bufferDistance * Math.cos(angle * Math.PI / 180))   // edge projected outwards to avoid landing close
        let projPosY = position.posY + Math.round(options.bufferDistance * Math.sin(angle * Math.PI / 180))
        // let line = this.drawLine({posX: offPosX, posY: offPosY}, {posX: projPosX, posY: projPosY}, angle)
        for (const edge of this.edges) {
            let positions = edge.getPositions()
            let intersected = intersects.lineLine(offPosX, offPosY, projPosX, projPosY,
                positions[0].posX, positions[0].posY, positions[1].posX, positions[1].posY, options.bufferWidth, options.bufferWidth)
            if (intersected) {
                intersections.push(edge)
            }
            if (intersected && !options.returnIntersections) {
                // line.clear()
                // line = this.drawLine({posX: offPosX, posY: offPosY}, {posX: projPosX, posY: projPosY}, angle, 0xe74c3c)
                return true
            }
        }
        if (!options.returnIntersections) {
            return false
        } else {
            return intersections
        }
    }

    findValidAngle = (node) => {
        let angle = null
        let usedAngles = node.getEdgeAngles()
        let angleSet = new Set()
        angleSet.add(0).add(45).add(90).add(135).add(180).add(225).add(270).add(315)
        let angleDeck = new Tombola().deck( [0, 0, 0, 0, 90, 90, 90, 90, 135, 180, 180, 180, 180, 225, 270, 270, 270, 270, 315] )
        while (angleDeck.contents.length > 0) {
            angle = angleDeck.draw()
            if (!usedAngles.has(angle) && angleSet.has(angle)) {
                angleSet.delete(angle)
                if (!this.testIntersection(node.position, angle, {bufferWidth: 60, bufferDistance: 300})) {
                    return angle
                }
            }
        }
        return -1
    }


    createRandomNode = () => {
        let validNode = false
        let angle
        let selectedNode = this.nodeDeck.draw()
        while (!validNode) {
            angle = this.findValidAngle(selectedNode)
            if (angle == -1 || angle == undefined) {
                this.nodeDeck.insert(selectedNode)
                selectedNode = this.nodeDeck.draw()
            } else {
                validNode = true
            }
        }
        let options = { distance: new Tombola().range(60, 130) }
        // if (!this.extendEdge(selectedNode, angle)) {
        if (true) {
            let newPosX = selectedNode.position.posX + Math.round(options.distance * Math.cos(angle * Math.PI / 180))
            let newPosY = selectedNode.position.posY + Math.round(options.distance * Math.sin(angle * Math.PI / 180))
            let newNode = new Node(selectedNode.stage, { posX: newPosX, posY: newPosY })
            let newEdge = new Edge(selectedNode.stage, { connectingNodes: [selectedNode, newNode], angle: angle})
            newNode.addEdge(newEdge)
            selectedNode.edgeSet.add(newEdge)
            if (selectedNode.edgeSet.size < 3) {
                this.nodeDeck.insert(selectedNode)
            }
            this.nodeDeck.insert(newNode)
            this.nodes.add(newNode)
            this.edges.add(newEdge)
        }
    }

    createNode = (newPosX, newPosY, options) => {
        let newNode = new Node(this.stage, { posX: newPosX, posY: newPosY })
        let angle = Math.round(Math.atan2(newNode.position.posY - options.sourceNode.position.posY,
            newNode.position.posX - options.sourceNode.position.posX) * 180 / Math.PI)
        this.extendEdge(options.sourceNode, angle)
        // console.log(this.testIntersection({posX: options.sourceNode.position.posX, posY: options.sourceNode.position.posY}, angle, { returnIntersections: true }))
        let newEdge = new Edge(this.stage, { connectingNodes: [options.sourceNode, newNode], angle: angle})
        newNode.addEdge(newEdge)
        this.nodes.add(newNode)
        this.edges.add(newEdge)
        return newNode
    }

    drawLine = (startPos, endPos, angle, colour = 0x27ae60) => {
        let rectangle = new PIXI.Graphics()
        rectangle.beginFill(colour); // Dark blue gray 'ish
        let distance = Math.hypot(startPos.posX - endPos.posX, startPos.posY - endPos.posY)
        rectangle.drawRect(0, 0, distance, 10); // drawRect(x, y, width, height)
        rectangle.position.set(startPos.posX, startPos.posY)
        rectangle.endFill();
        rectangle.angle = angle
        this.stage.addChildAt(rectangle, 2)
        return rectangle
    }

    drawCircle = (posX, posY, colour=0x27ae60) => {
        let circle = new PIXI.Graphics()
        circle.beginFill(colour)
        circle.drawCircle(0, 0, 10)
        circle.position.set(posX, posY)
        circle.endFill()
        this.stage.addChildAt(circle, 2)
        return circle

    }

    generateNorthNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 270 }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateNorthEastNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 315 }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateEastNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 360}
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateSouthEastNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 45 }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateSouthNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 90 }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateSouthWestNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 135 }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateWestNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 180 }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateNorthWestNode = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 225 }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    generateSocialHub = () => {
        let options = { distance: new Tombola().range(60, 130), direction: 225, nodeType: 'hub' }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
    }

    initPopulation = (populationSize) => {
        let nodesArray = Array.from(this.nodes)

        for (var i = 0; i < populationSize; i++) {
            let randomIndex = Math.floor(Math.random() * nodesArray.length)
            var bot = new Single(this.stage, nodesArray[randomIndex], {});
            this.bots.add(bot)
        }
    }
}

module.exports = Map
