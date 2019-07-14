class Colours{
    RED = 0xC92C26;
    BROWN = 0xA7804F;
    BLUE = 0x227275;
    TEAL = 0x0C6E5F;
    LIGHT_BLUE = 0x69ECDA;
    PINK = 0xD34768;
    LIME = 0xC4DD70;
    TAN = 0xE9D38B;

    pallet = [this.RED, this.BROWN, this.BLUE, this.LIGHT_BLUE, this.TEAL, this.PINK, this.LIME, this.TAN];
    
    numColours = this.pallet.length;

    getRandomColour(){
        var randomColour = this.pallet[Math.floor(Math.random() * this.numColours)];
        return randomColour;
    }

    getPseudoRandomColour(colourToNotGet){
        console.log("ran this function - colour not to get: " + colourToNotGet);
        var randomColour = this.pallet[Math.floor(Math.random() * this.numColours)];
        while (randomColour === colourToNotGet){
            console.log("entered loop");
            randomColour = this.pallet[Math.floor(Math.random() * this.numColours)];
        }
        return randomColour;
    }
}

module.exports = Colours