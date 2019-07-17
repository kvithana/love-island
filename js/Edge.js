const _ = require('underscore')
const PIXI = require('pixi.js')
import { Ease, ease } from 'pixi-ease'
import House from './House.js';
const Tombola = require('./math/tombola.js')

function setDefaults(options, defaults) {
	return _.defaults({}, _.clone(options), defaults)
}

class Edge {
	constructor(stage, options) {
		this.edgeNodes = new Set()
		let defaults = {
			type: 0,
			connectingNodes: [],
			angle: 0,
			animate: true
		}
		options = setDefaults(options, defaults)
		this.type = options.type
		let positions = []
		options.connectingNodes.forEach(node => {
			this.edgeNodes.add(node)
			positions.push(node.position)
		})
		this.length = Math.hypot(positions[0].posX - positions[1].posX, positions[0].posY - positions[1].posY)
		this.angle = options.angle
		this.stage = stage

		// Draw a rectangle
		let rectangle = new PIXI.Graphics()
		rectangle.beginFill(0xDDDDDD); // Dark blue gray 'ish
		rectangle.drawRect(0, 0, 1, 10); // drawRect(x, y, width, height)
		let newPosX = positions[0].posX + Math.round(5 * Math.cos((this.angle - 90) * Math.PI / 180))
		let newPosY = positions[0].posY + Math.round(5 * Math.sin((this.angle - 90) * Math.PI / 180))
		rectangle.position.set(newPosX, newPosY)
		rectangle.endFill();
		rectangle.angle = this.angle
		stage.addChildAt(rectangle, 0.5)
		// Animate Rectangle
		ease.add(rectangle, { width: this.length }, { duration: 1000, reverse: false })

		this.rectangle = rectangle
		this.houses = []
		this.generateHouses() //GENERATE HOUSES EVERYWHERE

		// for(var i = 0; i < this.houses.length; i++) {
		// 	this.houses[i].drawHouse()
    	// }
	}

	// update an edge node
	update = (oldNode, newNode) => {
		if (this.edgeNodes.has(oldNode)) {
			this.edgeNodes.delete(oldNode)
			this.edgeNodes.add(newNode)
			let positions = this.getPositions()
			this.length = Math.hypot(positions[0].posX - positions[1].posX, positions[0].posY - positions[1].posY)
		} else {
			throw 'oldNode is not connected to edge.'
		}
	}

	// delete an edge node
	deleteNode = node => {
		return this.edgeNodes.delete(node)
	}

	// given a edge node, get destination node
	getDestination = sourceNode => {
		let found = null
		this.edgeNodes.forEach(node => {
			if (node != sourceNode) {
				found = node
				return
			}
		})
		if (!found) {
			throw ('Edge is not connected to specified source node.')
		} else {
			return found
		}
	}

	getPositions = () => {
		let positions = []
		this.edgeNodes.forEach(node => {
			positions.push(node.position)
		})
		return positions
	}

	// given a source node, return the angle to the edge node.
	getAngle = sourceNode => {
		let destNode = this.getDestination(sourceNode)
		return Math.round(Math.atan2(destNode.position.posY - sourceNode.position.posY,
			destNode.position.posX - sourceNode.position.posX) * 180 / Math.PI)
	}

	generateHouses = () => {
	let houseWidth = this.length / 10
	let numberOfHouses = Math.floor(this.length / houseWidth) * 2

		// First Side of the Road
		for (var i = 0; i < numberOfHouses; i++) {
			let house = new House(this.stage, this, {
				posX: this.rectangle.position.x + Math.round((houseWidth * Math.floor(i/2) + (i%2 ? houseWidth : 0)) * Math.cos(this.angle * Math.PI / 180) - Math.round(5 * Math.cos((this.angle - 90) * Math.PI / 180))),
				posY: this.rectangle.position.y + Math.round((houseWidth * Math.floor(i/2) + (i%2 ? houseWidth : 0)) * Math.sin(this.angle * Math.PI / 180) - Math.round(5 * Math.sin((this.angle - 90) * Math.PI / 180))),
				width: new Tombola().chance(1, 3) ? houseWidth - (houseWidth / 4) : houseWidth,
				height: new Tombola().cluster( 1, 20, 40, 5 ),
				angle: this.angle + (180 * (i%2)),
				isHabited: false,
			})

			this.houses.push(house)
		}
	}

	getAvailableHouse = () => {
		let availableHouses = []
		// let availableHouse = null
		for (var house of this.houses) {
			if (house.isHabited == false) {
				availableHouses.push(house)
			}
		}
		// Sets the chance of clustering to a value
		let chanceOfClustering = (Math.random() < 0.8)

		let length = availableHouses.length;

		if(chanceOfClustering) {
			// if all houses are available on the edge, then let it build on the node
			if (length == 20) {
				return availableHouses[0]
			} else if (length > 0 ) {
				for(var i = 0; i < length - 1; i++) {
					var nextElement = availableHouses[i + 1];

					if(nextElement.isHabited) {
						return availableHouses[i]
					} else{
						return availableHouses[i+1]
					}
				}
			} else {
				console.log('No available houses')
				return false	
			}
		} else {
			let availableHousesDeck = new Tombola().deck( availableHouses )
			return(availableHousesDeck.draw())
		}
		
	}
}

module.exports = Edge
