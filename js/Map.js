const Node = require('./Node.js')
const Edge = require('./Edge.js')
const Tombola = require('./math/tombola')


class Map {
    constructor (stage) {
        this.nodes = new Set()
        this.nodeDeck = new Tombola().deck()

        let a = new Node(stage)
        this.nodes.add(a)
        this.nodeDeck.insert(a)
    }

    createRandomNode = () => {
        let options = { distance: new Tombola().range(80,150) }
        let selectedNode = this.nodeDeck.draw()
        let result = selectedNode.createRandomEdge(options)
        this.nodeDeck.insert(result.newNode)
        this.nodes.add(result.newNode)
        return { newNode: result.newNode, newEdge: result.newEdge }
    }
}

module.exports = Map