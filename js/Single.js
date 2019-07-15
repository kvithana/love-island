import Couple from './Couple.js';
import Bot from './Bot.js';
import Colours from './Colours.js';
const colours = new Colours();
const _ = require('underscore');
const PIXI = require('pixi.js');

const numberOfColours = Colours.numColours;
//every milestoneYears years they will lower their standards
const milestoneYears = 10;

class Single extends Bot {
    relationship = null; //instantiated with a successful proposal
    personalRelationshipSatisfaction = null; //instantiated with a successful proposal
    alive = true; //changed if they die
    constructor(stage, node, options) {
        super(stage, node, options);

        //target identity not a paremeter, as it needs to be different from the actual identity ("pesudorandom")
        this.targetIdentity = [colours.getPseudoRandomColour(this.identity)]
    }

    //returns target identity array index if target identity suits the candidate's actual identity, -1 if not
    //therefore a low return value (like 0, or 1) would mean a really good match. A high one would mean they're getting desperate
    getCompatability(otherSingleBot){
        var identityApproval = this.targetIdentity.indexOf(otherSingleBot.identity);
        return identityApproval;
    }

    propose(otherSingleBot){
        if(this.getCompatability(otherSingleBot) > -1){
            if (otherSingleBot.getCompatability(this) > -1){
                this.personalRelationshipSatisfaction = numberOfColours - this.getCompatability(otherSingleBot);
                otherSingleBot.personalSatisfaction = numberOfColours - otherSingleBot.getCompatability(this);
                this.relationship = new Couple(this.stage, this,otherSingleBot);
                otherSingleBot.relationship = this.relationship;
                this.circle.destroy();
                otherSingleBot.circle.destroy();
                this.stage.removeChild(this.circle);
                this.stage.removeChild(otherSingleBot.circle);
                this.alive = false;
                otherSingleBot.alive = false;
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

    //returns direct reference to the other partner in the relationship (the partner not passed in as argument)
    getOtherPartner(partner){
        if(this.spouse1 == partner){
            return this.spouse2;
        }
        else if(this.spouse2 == partner){
        return this.spouse1;
        }
        else{
            throw "CALLING PARTNER IS NOT EITHER PARTNER IN RELATIONSHIP"
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
            while (newTargetColourInserted == false && this.targetIdentity.length < numberOfColours){
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
}

module.exports = Single;
export default Single;