const Node = require('./js/Node.js')
const Edge = require('./js/Edge.js')

const MIN_EDGE_DIST = 20;

class Map {
    constructor () {
        this.nodes = new Set();
        this.edges = new Set();
        this.outerNodes = new Set();
    }

    createRandomNode = () => {
        options = {}
        node = new Node(options)
        this.nodes.add(node)
    }



}
