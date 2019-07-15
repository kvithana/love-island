import Bot from './Bot.js';

class Relationship {
    children = [];

    constructor(spouse1, spouse2) {
        this.spouse1 = spouse1;
        this.spouse2 = spouse2;
        this.spouse1Satisfaction = spouse1.relationshipSatisfaction;
        this.spouse2Satisfaction = spouse2.relationshipSatisfaction;
        this.relationshipSatisfaction = this.spouse1Satisfaction + this.spouse2Satisfaction;
    }


    haveSex(){
        var randomNumber = Math.random();
        var ageSum = this.spouse1.age + this.spouse2.age;
        var hurdle;
        if (ageSum < 50){
            hurdle = 0.8;
        }
        else if(ageSum < 60){
            hurdle = 0.6;
        }
        else if(ageSum < 80){
            hurdle = 0.4;
        }
        else{
            hurdle = 0.2;
        }
        if (hurdle > randomNumber){
            //make a baby
            var genePool = [this.spouse1.identity, this.spouse2.identity];
            var inheritedIdentity = genePool[Math.floor(Math.random() * genePool.length)];
            var baby = new Bot({age:0, identity:inheritedIdentity});
            this.children.push(baby);
            return baby
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
}

export default Relationship;