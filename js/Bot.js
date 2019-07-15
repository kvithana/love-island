import Relationship from './Relationship.js';
import Colours from './Colours.js';
const colours = new Colours();
import { isNull } from 'util';
const _ = require('underscore');
const PIXI = require('pixi.js')

function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults);
}

const numberOfColours = Colours.numColours;
//every milestoneYears years they will lower their standards
const milestoneYears = 10;

class Bot {
    relationship = null; //instantiated with a successful proposal
    personalRelationshipSatisfaction = null; //instantiated with a successful proposal
    alive = true; //changed if they die
    constructor(stage, options) {
        this.stage = stage
        let defaults = {
            alive: true,
            age: 0,
            identity:colours.getRandomColour(),
            posX: 0,
            posY: 0,
            isBusy: false
        }
        options = setDefaults(options, defaults)
        
        this.alive = options.alive;
        this.age = options.age;
        this.identity = options.identity;
        this.age = options.age;
        this.posX = options.posX;
        this.posY = options.posY;

        //target identity not a paremeter, as it needs to be different (pesudorandom) from the actual identity
        this.targetIdentity = [colours.getPseudoRandomColour(this.identity)],
        // Draw Circle
        this.circle = new PIXI.Graphics()
        this.circle.lineStyle(0);
        this.circle.beginFill(this.identity, 1);
        this.circle.lineStyle(3, this.targetIdentity);  //(thickness, color)
        this.circle.drawCircle(0, 0, 10);
        this.circle.endFill();
        this.circle.position.set(this.posX, this.posY)
        stage.addChild(this.circle)
    }

    //returns false if they're in a relationship - depends on the 'null' value
    isSingle(){
        if(isNull(this.relationship)){
            return true;
        }
        else{
            return false;
        }
    }


    //returns target identity array index if target identity suits the candidate's actual identity, -1 if not
    //therefore a low return value (like 0, or 1) would mean a really good match. A high one would mean they're getting desperate
    getCompatability(otherBot){
        var identityApproval = this.targetIdentity.indexOf(otherBot.identity);
        return identityApproval;
    }

    propose(otherBot){
        if(this.getCompatability(otherBot) > -1){
            if (otherBot.getCompatability(this) > -1){
                this.personalRelationshipSatisfaction = numberOfColours - this.getCompatability(otherBot);
                otherBot.personalSatisfaction = numberOfColours - otherBot.getCompatability(this);
                this.relationship = new Relationship(this,otherBot);
                otherBot.relationship = this.relationship;
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

    //should be called every 'year' 
    //every 'milestoneYears' years a new colour is added to their target identity
    //death - changes alive attribute of self (and of partner if they have one)
    getOlder(stage){
        this.age += 1;
        //if they hit a milestone, they get a new target ('acceptable') colour/identity
        if (this.age % milestoneYears == 0){
            var newTargetColourInserted = false;
            while (newTargetColourInserted == false){
                newColour = colours.getRandomColour();
                if (this.targetIdentity.indexOf(newColour) == -1){
                    this.targetIdentity[this.targetIdentity.length] = newColour;
                    newTargetColourInserted = true;
                }
            }
        }
        //if they're unlucky, they die (chance increases each year)
        var randomValue = Math.random();
        if (randomValue < (this.age / 100)){
            this.alive = false;
            this.circle.destroy();
            if (!this.isSingle()) {
                //if they have a partner, they die too (of loneliness)
                var otherPartner = this.relationship.getOtherPartner(this);
                otherPartner.alive = false;
                otherPartner.circle.destroy();
            }
        }
    }

    tick() {
        this.move()
    }

    move() {
        
    }
}

module.exports = Bot;
export default Bot;