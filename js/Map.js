const Node = require('./Node.js')
const Edge = require('./Edge.js')
const Tombola = require('./math/tombola')
import Bot from './Bot.js';

class Map {
    constructor (stage) {
        this.nodes = new Set()
        this.bots = new Set()
        this.nodeDeck = new Tombola().deck()
        this.stage = stage;

        console.log(`nodes: ${this.nodes}`)
        console.log(this.nodes)

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

    initPopulation = (populationSize) => {
        let nodesArray = Array.from(this.nodes)

        for (var i = 0; i < populationSize; i++) {
            let randomIndex = Math.floor(Math.random() * nodesArray.length)
            console.log('creating person')
            console.log('---')
            console.log(nodesArray[randomIndex])
            var bot = new Bot(this.stage, {
                posX: nodesArray[randomIndex].position.posX,
                posY: nodesArray[randomIndex].position.posY,
                node: nodesArray[randomIndex]
            });
            this.bots.add(bot)
            console.log(`Bot posX: ${bot.posX} and posY: ${bot.posY}`)
            console.log(`Node posX: ${nodesArray[randomIndex].position.posX} and posY: ${nodesArray[randomIndex].position.posY}`)

        }
    }
}

module.exports = Map
