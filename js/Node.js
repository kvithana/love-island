const Edge = require('./Edge')
const Tombola = require('./math/tombola')
const _ = require('underscore')
const PIXI = require('pixi.js')

let DECK = new Tombola().deck( [0, 45, 90, 135, 180, 225, 270, 315] )

function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults);
}

class Node {
    constructor(stage, options) {
        this.stage = stage
        this.edgeSet = new Set();
        
        let defaults = {
            isHub: false,
            posX: 0, 
            posY: 0
        }
        options = setDefaults(options, defaults)
        this.position = {posX: options.posX, posY: options.posY}
        this.isHub = options.isHub

        // Draw Circle
        let circle = new PIXI.Graphics()
        circle.lineStyle(0);
        circle.beginFill(0xDE3249, 1);
        circle.drawCircle(0, 0, 20);
        circle.endFill();
        console.log(this.position)
        circle.position.set(this.position.posX, this.position.posY)
        stage.addChild(circle)
    }

    // get a set of connected edges to this node
    getConnectedNodes = () => {
        let nodes = new Set()
        this.edgeSet.forEach( (edge) => {
            nodes.add(edge.getDestination(this))
        })
        return nodes
    }

    createRandomEdge = (options) => {
        let validAngle = false
        let currentAngles = this.getEdgeAngles()
        console.log(currentAngles)
        let angle = null
        while (!validAngle) {
            angle = DECK.look()
            // TO DO: check for other nodes which are close / other edge intersections
            if (!currentAngles.has(angle))
            validAngle = true
        }
        let newPosX = this.position.posX + Math.round(options.distance * Math.cos(angle * Math.PI / 180))
        let newPosY = this.position.posY + Math.round(options.distance * Math.sin(angle * Math.PI / 180))
        let newNode = new Node(this.stage, { posX: newPosX, posY: newPosY })
        let newEdge = new Edge(this.stage, { connectingNodes: [this, newNode], angle: angle})
        newNode.addEdge(newEdge)
        // console.log(angle)
        // console.log(newPosX, newPosY)
        // console.log(newEdge.length)
        this.edgeSet.add(newEdge)
        return { newNode: newNode, newEdge: newEdge}
    }

    getEdgeAngles = () => {
        let angles = new Set()
        this.edgeSet.forEach( edge => {
            angles.add(edge.getAngle(this))
        })
        return angles
    }

    // add an edge to a node
    addEdge = (edge) => {
        return this.edgeSet.add(edge)
    }

    // remove an edge of a node
    deleteEdge = (edge) => {
        return this.edgeSet.delete(edge)
    }

    // check if an edge is connected to this node
    hasEdge = (edge) => {
        return this.edgeSet.has(edge)
    }

}

module.exports = Node;