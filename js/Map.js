const Node = require('./Node.js')
const Edge = require('./Edge.js')
const Tombola = require('./math/tombola')
import Single from './Single.js';
import BotSet from './State.js';
import { State } from 'pixi.js';

class Map {
    constructor (stage) {
        this.nodes = new Set()
        this.bots = BotSet;
        this.nodeDeck = new Tombola().deck()
        this.stage = stage;
        let a = new Node(stage)
        this.nodes.add(a)
        this.nodeDeck.insert(a)
        this.source = a //don't push
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
            var bot = new Single(this.stage, nodesArray[randomIndex], {});
            this.bots.add(bot)
        }
    }
}

module.exports = Map
