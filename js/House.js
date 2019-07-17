const _ = require('underscore')
const PIXI = require('pixi.js')
const { Ease, ease } = require ('pixi-ease')


function setDefaults(options, defaults) {
    return _.defaults({}, _.clone(options), defaults);
}

class House {
    constructor(stage, edge, options) {
        this.edge = edge
        let defaults = {
            posX: 0,
            posY: 0,
            width: 0,
            height: 0,
            angle: 0,
			isHabited: false,
        }

        options = setDefaults(options, defaults)

        this.posX = options.posX
        this.posY = options.posY
        this.width = options.width
        this.height = options.height
		this.angle = options.angle
		this.stage = stage
        this.isHabited = options.isHabited
        this.isDrawn = options.isDrawn
    }

    drawHouse = () => {
        // Draw a house somewhere on the edge
        let house = new PIXI.Graphics()
        // Either terracotta or light yellow
        let color = Math.random() < 0.9 ? 0xFFFBCF : 0xFFCFD3;
        house.beginFill(color)
        house.drawRect(0, 0, this.width, 0.01)
        house.position.set(this.posX, this.posY)
        house.endFill();
        house.angle = this.angle
        this.stage.addChildAt(house, 0)

        // Animate house
        ease.add(house, { height: this.height}, { duration: 1000, reverse: false })
        ease.add(house, { skewX: 0.4 }, { duration: 500, reverse: true })

        // Set it to habited
        this.isDrawn = true
    }

}

module.exports = House;

