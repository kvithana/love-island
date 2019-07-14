const _ = require('underscore')
const PIXI = require('pixi.js')
import { Ease, ease } from 'pixi-ease'

function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults)
}

class Edge {
    constructor (stage, options) {
        this.edgeNodes = new Set()
        let defaults = {
            type: 0,
            connectingNodes: [],
            angle: 0
        }
        options = setDefaults(options, defaults)
        this.type = options.type
        let positions = []
        options.connectingNodes.forEach( node => {
            this.edgeNodes.add(node)
            positions.push(node.position)
        })
        this.length = Math.hypot(positions[0].posX - positions[1].posX, positions[0].posY - positions[1].posY)
        this.angle = options.angle

        // Draw a rectangle
        let rectangle = new PIXI.Graphics()
        rectangle.beginFill(0xDDDDDD); // Dark blue gray 'ish
        rectangle.drawRect(0, 0, 1, 10); // drawRect(x, y, width, height)
        console.log(positions)
        rectangle.position.set(positions[0].posX, positions[0].posY)
        rectangle.endFill();
        rectangle.angle = this.angle
        stage.addChildAt(rectangle, 0)
        // Animate Rectangle
        ease.add(rectangle, { width: this.length }, { duration: 1000, reverse: false })
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
        let found = null
        this.edgeNodes.forEach(node => {
        if (node != sourceNode) {
            found = node
            return
        }
        })
        if (!found) {
            throw('Edge is not connected to specified source node.')
        } else {
            return found
        }
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

module.exports = Edge
