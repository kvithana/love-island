import Single from './Single.js';
import Bot from './Bot.js';
const PIXI = require('pixi.js');


class Couple extends Bot{
    children = [];

    constructor(stage, spouse1, spouse2) {
        super();
        this.age = Math.floor(spouse1.age + spouse2.age / 2);
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
        if (hurdle > randomNumber){
            //make a baby
            var genePool = [this.spouse1.identity, this.spouse2.identity];
            var inheritedIdentity = genePool[Math.floor(Math.random() * genePool.length)];
            var baby = new Single({age:0, identity:inheritedIdentity,node:this.spouse1.node});
            this.children.push(baby);
            return baby;
        }
        else{
            return false;
        }
    }

    getOlder(){
        this.age +=1
        //if they're unlucky, they die (chance increases each year)
        var randomValue = Math.random();
        if (randomValue < (this.age / 100)){
            this.alive = false;
            this.spouse1.alive = false;
            this.spouse2.alive = false;
            this.circle.destroy();
        }
          
    }
}

export default Couple;