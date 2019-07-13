const Edge = require('./Edge')
const Tombola = require('./math/tombola')
const _ = require('underscore')

let DECK = new Tombola().deck( [0, 45, 90, 135, 180, 225, 270, 315] )

function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults);
}

class Node {
    constructor(options) {
        this.edgeSet = new Set();
        
        let defaults = {
            isHub: false,
            connectingEdge: false,
            posX: 0, 
            posY: 0
        }
        options = setDefaults(options, defaults)

        this.position = {posX: options.posX, posY: options.posY}
        this.isHub = options.isHub
        if (options.connectingEdge) {
            this.edgeSet.add(options.connectingEdge)
        }
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
        while (!validAngle) {
            let angle = DECK.look()
            // TO DO: check for other nodes which are close / other edge intersections
            if (!currentAngles.has(angle))
            validAngle = true
        }

        let newPosX = options.distance * cos(angle * Math.PI / 180)
        let newPosY = options.distance * sin(angle * Math.PI / 180)
        let newNode = new Node({ posX: newPosX, posY: newPosY })
        let newEdge = new Edge({ distance: options.distance, connectingNodes: [this, newNode]})
        this.edgeSet.add(newEdge)
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