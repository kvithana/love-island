const _ = require('underscore')

function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults)
}

class Edge {
    constructor (options) {
        this.edgeNodes = new Set()
        let defaults = { 
            length: 20,
            type: 0,
            connectingNodes: []
        }
        options = setDefaults(options, defaults)

        this.length = options.length
        this.type = options.type
        options.connectingNodes.forEach( node => {
            this.edgeNodes.add(node)
        })
        }

  // update an edge node
    update = (oldNode, newNode) => {
        if (this.edgeNodes.has(oldNode)) {
        this.edgeNodes.delete(oldNode)
        this.edgeNodes.add(newNode)
        } else {
        throw 'oldNode is not connected to edge.'
        }
    }

  // delete an edge node
    deleteNode = node => {
        return this.edgeNodes.delete(node)
    }

    // given a edge node, get destination node
    getDestination = sourceNode => {
        this.edgeNodes.forEach(node => {
        if (node != sourceNode) {
            return node
        }
        })
        raise('Edge is not connected to specified source node.')
    }

    getPositions = () => {
        let positions = []
        this.edgeNodes.forEach(node => {
            positions.push(node.position)
        })
        return positions
    }

    // given a source node, return the angle to the edge node.
    getAngle = sourceNode => {
        let destNode = this.getDestination(sourceNode)
        return Math.round(Math.atan2(destNode.position.posY - sourceNode.position.posY,
            destNode.position.posX - sourceNode.position.posX) * 180 / Math.PI)
    }
}
