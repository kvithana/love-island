import Single from './Single.js';
import Bot from './Bot.js';
import Map from './Map.js';
import RootState from './RootState.js';
const PIXI = require('pixi.js');
const Tombola = require('./math/tombola')



class Couple extends Bot{
    maxChildren = 3;
    children = new Set();

    constructor(stage, spouse1, spouse2) {
        super(stage, spouse1.node,{
            age : Math.floor(spouse1.age + spouse2.age / 2)
        });
        this.house = RootState.map.getRandomFreePlot();
        this.spouse1 = spouse1;
        this.spouse2 = spouse2;
        this.anniversaryNode = spouse1.node;
        this.spouse1Satisfaction = spouse1.relationshipSatisfaction;
        this.spouse2Satisfaction = spouse2.relationshipSatisfaction;
        this.relationshipSatisfaction = this.spouse1Satisfaction + this.spouse2Satisfaction;
        this.actions = [ this.moveToRandom ]
        this.traits = [ 1 ]
        this.relationshipStatus = true

        // Draw Circle
        this.circle = new PIXI.Graphics()
		this.circle.lineStyle(0);
		// Draw first circle
        this.circle.beginFill(spouse1.identity, 1);
        //this.circle.lineStyle(3, spouse2.identity);  //(thickness, color)
		this.circle.drawCircle(0, 0, 10);
		this.circle.endFill();
		// Draw second circle
		this.circle.beginFill(spouse2.identity, 1);
		this.circle.drawCircle(20, 0, 10);
		this.circle.endFill();
        this.circle.position.set(spouse1.node.position.posX, spouse1.node.position.posY)
        stage.addChild(this.circle)
        //add couple to the botset
		RootState.BotSet.add(this);

    }

    tick() {
        // If the Bot is not busy
        if (!this.house.isHabited) {
            this.moveToHouse()
            this.house.isHabited = true
        }
        if (!this.isBusy) {
          let node = this.state.moveQueue.pop()
          if (node) {
            // If the node is the house, build it (if it's not already built)
            if (node.pseudonode) {
                if (!this.house.isDrawn) {
                    this.house.drawHouse();
                }
            }
            this.move(node)
          } else {
            new Tombola().weightedFunction(this.actions, this.traits)
          }
          // this.getOlder();
        }
        this.incrementWaiting()
      }

    haveSex() {
        var randomNumber = Math.random();
        var hurdle;
        if (this.age < 50){
            hurdle = 0.8;
        }
        else if(this.age < 60){
            hurdle = 0.6;
        }
        else if(this.age < 80){
            hurdle = 0.4;
        }
        else{
            hurdle = 0.2;
        }
        if (hurdle > randomNumber && this.children.size < this.maxChildren){
            //make a baby
            var genePool = [this.spouse1.identity, this.spouse2.identity];
            var inheritedIdentity = genePool[Math.floor(Math.random() * genePool.length)];
            var baby = new Single(this.stage, this.spouse1.node, {age:0, identity:inheritedIdentity});
            this.children.add(baby);
            RootState.BotSet.add(baby);
            return baby;
        }
        else{
            return false;
        }
    }

    getOlder(){
        this.age++;
        //if they're unlucky, they die (chance increases each year)
        var randomValue = Math.random();
        if (randomValue < (this.age / this.invincibility)){
            this.alive = false;
            this.circle.destroy();
            RootState.BotSet.delete(this)
        }
    }

    moveToRandom = () => {
        this.moveToNode(RootState.map.getRandomNode(), {})
    }

    moveToHouse = () => {
        // Determine the shortest route to the house plot by checking distance to both edge nodes
        let node1 = Array.from(this.house.edge.edgeNodes)[0]
        let node2 = Array.from(this.house.edge.edgeNodes)[1]
        let route1 = RootState.map.pathFinder.pathTo(this.node, node1);
        let route2 = RootState.map.pathFinder.pathTo(this.node, node2);
        let destination;
        route1.length > route2.length ? destination = node2 : destination = node1;
        let options = {};
        options.finalPosition = { bots: new Set(), position : { posX: this.house.posX, posY: this.house.posY }, pseudonode: true }
        this.moveToNode(destination, options)
    }

    buildHouse() {
      // find an edge

      // ask the edge if there is an available house

      // move to the edge

      // build house
    }
}

export default Couple;
