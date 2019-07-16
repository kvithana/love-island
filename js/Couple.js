import Single from './Single.js';
import Bot from './Bot.js';
import Map from './Map.js';
import RootState from './RootState.js';
const PIXI = require('pixi.js');


class Couple extends Bot{
    maxChildren = 3;
    children = new Set();

    constructor(stage, spouse1, spouse2) {
        super(stage, spouse1.node,{
            age : Math.floor(spouse1.age + spouse2.age / 2)
        });
        this.spouse1 = spouse1;
        this.spouse2 = spouse2;
        this.spouse1Satisfaction = spouse1.relationshipSatisfaction;
        this.spouse2Satisfaction = spouse2.relationshipSatisfaction;
        this.relationshipSatisfaction = this.spouse1Satisfaction + this.spouse2Satisfaction;
        
        // Draw Circle
        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(0);
        this.circle.beginFill(spouse1.identity, 1);
        this.circle.lineStyle(3, spouse2.identity);  //(thickness, color)
        this.circle.drawCircle(0, 0, 30);
        this.circle.endFill();
        this.circle.position.set(spouse1.posX, spouse1.posY)
        stage.addChild(this.circle)
        //remove single circles from map
        this.spouse1.circle.destroy();
        this.spouse2.circle.destroy();
        stage.removeChild(this.spouse1.circle);
        stage.removeChild(this.spouse2.circle);
        //they are no longer alive
        this.spouse1.alive = false;
        this.spouse2.alive = false;
        //Then remove them from the big array, add couple to the big array
        RootState.BotSet.delete(this.spouse1);
        RootState.BotSet.delete(this.spouse2);
        RootState.BotSet.add(this);

    }


    haveSex(){
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
}

export default Couple;