const Node = require('./Node')
const Edge = require('./Edge')
const Helper = require('./math/helper')

class MapCreator {
    constructor(map) {
        this.map = map
        this.stage = map.stage
    }

    createWalls = (source = {posX: 0, posY: 0}, radius = 1000) => {
        let d = [400,   360,    350,    330,    400,    380,    450,    410,    420,    500,    430,    450,    350]
        let a = [10,    25,     45,     90,     110,    125,    170,    180,    225,    240,    270,    290,    350]
        let f = [0,     1,      0,      1,      0,      1,      0,      1,      1,      0,      1,      0,      1]
        // new Node(this.stage, { posX: 0, posY: 0 , type: "wall" })

        for (let i = 0; i < d.length; i++) {
            d[i] = d[i] * radius / Math.min(...d)
        }
        console.log(d)

        let pos = new Helper().calculateCoordsFromVector({ position: source}, a[0], d[0])
        let n1 = new Node(this.stage, { posX: pos.posX, posY: pos.posY , type: "wall" })
        let nodes = [n1]
        let entries = []
        let edges = []
        for (let i=1; i < a.length; i++) {
            let pos = new Helper().calculateCoordsFromVector({ position: source}, a[i], d[i])
            let newNode = this.createNode(pos.posX, pos.posY, { type: "wall", sourceNode: nodes[i-1]})
            nodes.push(newNode.node)
            if (f[i] == 1) {
                entries.push(newNode.node)
            }
            edges.push(newNode.edge)
        }
        console.log(nodes[0])
        let angle = Math.round(Math.atan2(nodes[nodes.length - 1].position.posY - nodes[0].position.posY,
            nodes[nodes.length - 1].position.posX - nodes[0].position.posX) * 180 / Math.PI)
        let finalEdge = new Edge(this.stage, { connectingNodes: [nodes[0], nodes[nodes.length - 1]], angle: angle, type: "wall" })
        edges.push(finalEdge)
        console.log(edges, entries)
        return { 
            edges,
            nodes: entries
    }
    }

    createRiver = () => {
        
    }

    createNode = (newPosX, newPosY, options) => {
        let newNode = new Node(this.stage, { posX: newPosX, posY: newPosY, type: options.type })
        let angle = Math.round(Math.atan2(newNode.position.posY - options.sourceNode.position.posY,
            newNode.position.posX - options.sourceNode.position.posX) * 180 / Math.PI)
        let newEdge = new Edge(this.stage, { connectingNodes: [options.sourceNode, newNode], angle: angle, type: options.type })
        // newNode.addEdge(newEdge)
        // options.sourceNode.addEdge(newEdge)
        return { node: newNode, edge: newEdge }
    }
}

module.exports = MapCreator