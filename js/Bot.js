import Colours from './Colours.js';
const colours = new Colours();
const _ = require('underscore');
const PIXI = require('pixi.js')
import { Ease, ease } from 'pixi-ease'

function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults);
}

const numberOfColours = Colours.numColours;
//every milestoneYears years they will lower their standards
const milestoneYears = 10;


class Bot {
    relationship = null; //instantiated with a successful proposal
    alive = true; //changed if they die
    constructor(stage, node, options) {
        this.stage = stage
        let defaults = {
            alive: true,
            age: 0,
            identity:colours.getRandomColour(),
            isBusy: false,
        }
        options = setDefaults(options, defaults)

        this.alive = options.alive;
        this.age = options.age;
        this.identity = options.identity;
        this.targetIdentity = [colours.getPseudoRandomColour(this.identity)]
        this.node = node;
        this.posX = this.node.position.posX;
        this.posY = this.node.position.posY;
        this.isBusy = false
        this.tickData = { remaining: 0 , queue: null }
    }

    //returns current shape position
    getPosition = () => {
      return this.circle.position
    }

    tick() {
      if (!this.isBusy) {
        this.move()
      }
      this.incrementWaiting()
    }

    wait = (ticks) => {
      ticks = Math.round(ticks / 100)
      this.tickData.remaining = ticks
    }

    incrementWaiting = () => {
      if (this.tickData.remaining > 0) {
        this.tickData.remaining -= 1
        this.isBusy = true
      }
      else {
        this.isBusy = false
      }
    }

    move() {
        //the 'next node' is a random node from the list of nodes connected to the current node
        let nextNodes = Array.from(this.node.getConnectedNodes())
        let nextNode = nextNodes[Math.floor(Math.random() * nextNodes.length)]
        ease.add(this.circle, { x: nextNode.position.posX, y: nextNode.position.posY }, { duration: 1000, reverse: false })
        this.wait(1000)
        this.node = nextNode
        // moveBot.on('complete', () => this.isBusy = false)
    }
}

export default Bot;
