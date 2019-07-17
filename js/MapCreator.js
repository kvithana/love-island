const Node = require('./Node')
const Edge = require('./Edge')

class MapCreator {
    constructor(map) {
        this.map = map
        this.stage = map.stage
    }

    createWalls = () => {
        let width = 2000
        let height = 1000
        let a = new Node(this.stage, { posX: -1 * width / 2, posY: -1 * height / 2, type: "wall" })
        let entryTop = this.createNode(0, -1 * height / 2, {type: "wall", sourceNode: a})
        let b = this.createNode(width/2, -1 * height / 2, {type: "wall", sourceNode: entryTop.node})
        let entryRight = this.createNode(width / 2, 0, {type: "wall", sourceNode: b.node})
        let c = this.createNode(width / 2, height / 2, {type: "wall", sourceNode: entryRight.node})
        let entryBottom = this.createNode(0, height / 2, {type: "wall", sourceNode: c.node})
        let d = this.createNode(-1 * width / 2, height /2 , {type: "wall", sourceNode: entryBottom.node })
        let entryLeft = this.createNode(-1 * width / 2, 0, {type: "wall", sourceNode: d.node})
        let angle = Math.round(Math.atan2(a.position.posY - entryLeft.node.position.posY,
            a.position.posX - entryLeft.node.position.posX) * 180 / Math.PI)
        let finalEdge = new Edge(this.stage, { connectingNodes: [d.node, a], angle: angle, type: "wall" })
        return { 
            edges: [entryTop.edge, b.edge, entryRight.edge, c.edge, entryBottom.edge, d.edge, entryLeft.edge, finalEdge],
            nodes: [entryTop.node, entryRight.node, entryLeft.node, entryBottom.node]
    }
    }

    createNode = (newPosX, newPosY, options) => {
        let newNode = new Node(this.stage, { posX: newPosX, posY: newPosY, type: options.type })
        let angle = Math.round(Math.atan2(newNode.position.posY - options.sourceNode.position.posY,
            newNode.position.posX - options.sourceNode.position.posX) * 180 / Math.PI)
        let newEdge = new Edge(this.stage, { connectingNodes: [options.sourceNode, newNode], angle: angle, type: options.type })
        newNode.addEdge(newEdge)
        options.sourceNode.addEdge(newEdge)
        return { node: newNode, edge: newEdge }
    }
}

module.exports = MapCreator