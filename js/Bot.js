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
            looks:colours.getRandomColour(),
            personality: colours.getRandomColour(),
            targetLooks: [colours.getRandomColour()],
            targetPersonality: [colours.getRandomColour()],
            posX: 0,
            posY: 0
        }
        options = setDefaults(options, defaults)
        
        this.alive = options.alive;
        this.age = options.age;
        this.looks = options.looks;
        this.personality = options.personality;
        this.age = options.age;
        this.targetLooks = options.targetLooks;
        this.targetPersonality = options.targetPersonality;
        this.posX = options.posX;
        this.posY = options.posY;

        // Draw Circle
        let circle = new PIXI.Graphics()
        circle.lineStyle(0);
        circle.beginFill(this.looks, 1);
        circle.drawCircle(this.posX, this.posY, 30);
        circle.endFill();
        console.log(this.position)
        circle.position.set(this.posX, this.posY)
        stage.addChild(circle)
    }

    //returns true if they're in a relationship - depends on the 'null' value
    isSingle(){
        if(isNull(this.relationship)){
            return true;
        }
        else{
            return false;
        }
    }


    //returns sum of both targetLooks & targetPersonality array indexes if both looks and personality suit, -1 if not
    //therefore a low return value (like 0, or 1) would mean a really good match. A high one would mean they're getting desperate
    getCompatability(otherBot){
        var looksApproval = this.targetLooks.indexOf(otherBot.looks);
        var personalityApproval = this.targetPersonality.indexOf(otherBot.personality);

        if (looksApproval > -1 && personalityApproval > -1){
            return looksApproval + personalityApproval;
        }
        else{
            return -1;
        }
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
    //every 'milestoneYears' years a new colour is added to their target looks and personality
    //death - changes alive attribute of self (and of partner if they have one)
    getOlder(){
        this.age += 1;
        //if they hit a milestone, they get a new colour
        if (this.age % milestoneYears == 0){
            var newPersonalityColourInserted = false;
            var newLooksColourInserted = false;
            while (newPersonalityColourInserted == false){
                newColour = colours.getRandomColour();
                if (this.targetPersonality.indexOf(newColour) != -1){
                    this.targetPersonality[this.targetPersonality.length] = newColour;
                    newPersonalityColourInserted = true;
                }
            }
            while (newLooksColourInserted == false){
                var newColour = colours.getRandomColour();
                if (this.targetLooks.indexOf(newColour) != -1){
                    this.targetLooks[this.targetLooks.length] = newColour;
                    newLooksColourInserted = true;
                }
            }
        }
        //if they're unlucky, they die (chance increases each year)
        var randomValue = Math.random();
        if (randomValue < (this.age / 100)){
            this.alive = false;
            if (!this.isSingle()) {
                //if they have a partner, they die too (of loneliness)
                var otherPartner = this.relationship.getOtherPartner(this);
                otherPartner.alive = false;
            }
        }
    }
}

module.exports = Bot;
export default Bot;