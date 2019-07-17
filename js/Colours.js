class Colours{
    PURPLE = 0x5856A4;
    WATERMELON = 0xED5D92;
    NABRED = 0xC20000;
    GREEN = 0x8DCD59;
    LIGHT_BLUE = 0x59B5E4;
    LILAC = 0xB36DDD;
    DARKBLUE = 0x203D85;
    SEAWEED = 0x1D8F94;

    pallet = [this.PURPLE, this.WATERMELON, this.NABRED, this.GREEN, this.LIGHT_BLUE, this.LILAC, this.DARKBLUE, this.SEAWEED];
    
    numColours = this.pallet.length;

    getRandomColour(){
        var randomColour = this.pallet[Math.floor(Math.random() * this.numColours)];
        return randomColour;
    }

    getPseudoRandomColour(colourToNotGet){
        var randomColour = this.pallet[Math.floor(Math.random() * this.numColours)];
        while (randomColour === colourToNotGet){
            randomColour = this.pallet[Math.floor(Math.random() * this.numColours)];
        }
        return randomColour;
    }
}

module.exports = Colours