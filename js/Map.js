const Node = require('./Node.js')
const Edge = require('./Edge.js')
const Tombola = require('./math/tombola')
import Single from './Single.js';
import RootState from './RootState.js';
import { State } from 'pixi.js';
const intersects = require('intersects')
const lineIntersect = require('./math/line-intersect')
const _ = require('underscore')
const PIXI = require('pixi.js')
const PathFinder = require('./math/PathFinder')


function setDefaults(options, defaults) {
	return _.defaults({}, _.clone(options), defaults)
}


class Map {
	constructor(stage) {
		this.nodes = new Set()
		this.socialHubs = new Set()
		this.bots = RootState.BotSet;
		this.nodeDeck = new Tombola().deck()
		this.stage = stage;
		this.edges = new Set()
		this.source = new Node(stage)
		this.nodes.add(this.source)
		this.nodeDeck.insert(this.source)
		this.pathFinder = new PathFinder({ nodeSet: this.nodes, edgeSet: this.edges })
	}

	getIntersect(lineAStart, lineAEnd, lineBStart, lineBEnd) {
		let point = lineIntersect([[lineAStart.posX, lineAStart.posY], [lineAEnd.posX, lineAEnd.posY]],
			[[lineBStart.posX, lineBStart.posY], [lineBEnd.posX, lineBEnd.posY]])
		point = point.Right || point.Left
		return point
	}

	createIntermediateNode = (node, angle, edge) => {
		let newPosX = node.position.posX + Math.round(1000 * Math.cos(angle * Math.PI / 180))
		let newPosY = node.position.posY + Math.round(1000 * Math.sin(angle * Math.PI / 180))

		let positions = edge.getPositions()

		let point = this.getIntersect([node.position.posX, node.position.posY], [newPosX, newPosY],
			[positions[1].posX, positions[1].posY], [positions[0].posX, positions[0].posY])

		let a, b
		for (const n of edge.edgeNodes) {
			a = n
			break
		}
		b = edge.getDestination(a)
		// let line = this.drawLine({posX: node.position.posX, posY: node.position.posY}, {posX: newPosX, posY: newPosY}, angle, 0xe74c3c)
		// let line2 = this.drawLine({posX: positions[0].posX, posY: positions[0].posY}, {posX: positions[1].posX , posY: positions[1].posY}, edge.angle, 0xe74c3c)
		let newNode = new Node(this.stage, { posX: point[0], posY: point[1] })
		let newEdge = new Edge(this.stage, { connectingNodes: [newNode, b], animate: false, angle: edge.angle })
		this.nodes.add(newNode)
		this.edges.add(newEdge)
		// update current edge to end at new intermediate node
		edge.update(b, newNode)
		// add old edge as an edge of new node
		newNode.addEdge(edge)
		// add new edge as an edge of new node
		newNode.addEdge(newEdge)
		this.nodeDeck.insert(newNode)
		return newNode
	}

	extendEdge = (node, angle) => {
		let possibleEdges = this.testIntersection(node.position, angle, { returnIntersections: true, bufferDistance: 500 })
		let closestEdge = { distance: 10000, edge: null }
		let newPosX = node.position.posX + Math.round(1000 * Math.cos(angle * Math.PI / 180))
		let newPosY = node.position.posY + Math.round(1000 * Math.sin(angle * Math.PI / 180))
		for (const edge of possibleEdges) {
			let edgePositions = Array.from(edge.getPositions())
			let intersect = this.getIntersect(node.position, { posX: newPosX, posY: newPosY }, edgePositions[0], edgePositions[1])
			let dist = Math.hypot(intersect[0] - node.position.posX, intersect[1] - node.position.posY)
			if (dist < closestEdge.distance) {
				closestEdge.edge = edge
				closestEdge.distance = dist
			}
		}
		if (possibleEdges.length != 0) {
			let newNode = this.createIntermediateNode(node, angle, closestEdge.edge)
			let newEdge = new Edge(this.stage, { connectingNodes: [node, newNode], angle: angle })
			this.edges.add(newEdge)
		}
	}

	testIntersection = (position, angle, options) => {
		let defaults = {
			returnIntersections: false,
			bufferWidth: 1,
			bufferDistance: 500
		}
		let intersections = []
		options = setDefaults(options, defaults)
		let offPosX = position.posX + Math.round((options.bufferWidth * 2 / 3 + 5) * Math.cos(angle * Math.PI / 180))  // offset to avoid outgoing edges from current node
		let offPosY = position.posY + Math.round((options.bufferWidth * 2 / 3 + 5) * Math.sin(angle * Math.PI / 180))
		let projPosX = position.posX + Math.round(options.bufferDistance * Math.cos(angle * Math.PI / 180))   // edge projected outwards to avoid landing close
		let projPosY = position.posY + Math.round(options.bufferDistance * Math.sin(angle * Math.PI / 180))
		// let line = this.drawLine({posX: offPosX, posY: offPosY}, {posX: projPosX, posY: projPosY}, angle)
		for (const edge of this.edges) {
			let positions = edge.getPositions()
			let intersected = intersects.lineLine(offPosX, offPosY, projPosX, projPosY,
				positions[0].posX, positions[0].posY, positions[1].posX, positions[1].posY, options.bufferWidth, options.bufferWidth)
			if (intersected) {
				intersections.push(edge)
			}
			if (intersected && !options.returnIntersections) {
				// line.clear()
				// line = this.drawLine({posX: offPosX, posY: offPosY}, {posX: projPosX, posY: projPosY}, angle, 0xe74c3c)
				return true
			}
		}
		if (!options.returnIntersections) {
			return false
		} else {
			return intersections
		}
	}

	findValidAngle = (node) => {
		let angle = null
		let usedAngles = node.getEdgeAngles()
		let angleSet = new Set()
		angleSet.add(0).add(45).add(90).add(135).add(180).add(225).add(270).add(315)
		let angleDeck = new Tombola().deck([0, 0, 0, 0, 90, 90, 90, 90, 135, 180, 180, 180, 180, 225, 270, 270, 270, 270, 315])
		while (angleDeck.contents.length > 0) {
			angle = angleDeck.draw()
			if (!usedAngles.has(angle) && angleSet.has(angle)) {
				angleSet.delete(angle)
				if (!this.testIntersection(node.position, angle, { bufferWidth: 60, bufferDistance: 300 })) {
					return angle
				}
			}
		}
		return -1
	}


	createRandomNode = () => {
		let validNode = false
		let angle
		let selectedNode = this.nodeDeck.draw()
		while (!validNode) {
			angle = this.findValidAngle(selectedNode)
			if (angle == -1 || angle == undefined) {
				this.nodeDeck.insert(selectedNode)
				selectedNode = this.nodeDeck.draw()
			} else {
				validNode = true
			}
		}
		let options = { distance: new Tombola().range(100, 300) }
		// if (!this.extendEdge(selectedNode, angle)) { // BROKEN
		if (true) {
			let newPosX = selectedNode.position.posX + Math.round(options.distance * Math.cos(angle * Math.PI / 180))
			let newPosY = selectedNode.position.posY + Math.round(options.distance * Math.sin(angle * Math.PI / 180))
			let newNode = new Node(selectedNode.stage, { posX: newPosX, posY: newPosY })
			let newEdge = new Edge(selectedNode.stage, { connectingNodes: [selectedNode, newNode], angle: angle })
			newNode.addEdge(newEdge)
			selectedNode.edgeSet.add(newEdge)
			if (selectedNode.edgeSet.size < 3) {
				this.nodeDeck.insert(selectedNode)
			}
			this.nodeDeck.insert(newNode)
			this.nodes.add(newNode)
			this.edges.add(newEdge)
		}
	}

	createNode = (newPosX, newPosY, options) => {
		let newNode = new Node(this.stage, { posX: newPosX, posY: newPosY })
		let angle = Math.round(Math.atan2(newNode.position.posY - options.sourceNode.position.posY,
			newNode.position.posX - options.sourceNode.position.posX) * 180 / Math.PI)
		// this.extendEdge(options.sourceNode, angle)
		let newEdge = new Edge(this.stage, { connectingNodes: [options.sourceNode, newNode], angle: angle })
		newNode.addEdge(newEdge)
		options.sourceNode.addEdge(newEdge)
		this.nodes.add(newNode)
		this.edges.add(newEdge)
		return newNode
	}

	drawLine = (startPos, endPos, angle, colour = 0x27ae60) => {
		let rectangle = new PIXI.Graphics()
		rectangle.beginFill(colour); // Dark blue gray 'ish
		let distance = Math.hypot(startPos.posX - endPos.posX, startPos.posY - endPos.posY)
		rectangle.drawRect(0, 0, distance, 10); // drawRect(x, y, width, height)
		rectangle.position.set(startPos.posX, startPos.posY)
		rectangle.endFill();
		rectangle.angle = angle
		this.stage.addChildAt(rectangle, 2)
		return rectangle
	}

	drawCircle = (posX, posY, colour = 0x27ae60) => {
		let circle = new PIXI.Graphics()
		circle.beginFill(colour)
		circle.drawCircle(0, 0, 10)
		circle.position.set(posX, posY)
		circle.endFill()
		this.stage.addChildAt(circle, 2)
		return circle
	}

	getRandomSocialHub = () => {
		let socialHubs = Array.from(this.socialHubs);
		let randomIndex = Math.floor(Math.random() * socialHubs.length)
		return socialHubs[randomIndex]
	}

	getRandomNode = () => {
		let nodes = Array.from(this.nodes);
		let randomIndex = Math.floor(Math.random() * nodes.length)
		return nodes[randomIndex]
	}

	// getRandomFreePlot = (anniversaryNode) => {
	// 	// console.log(socialHub.edgeSet)
	// 	let centralNode = anniversaryNode

	// 	// Sets the chance of clustering to a value
	// 	let chanceOfClustering = (Math.random() < 0.9)
	// 	let edges = chanceOfClustering ? centralNode.edgeSet : this.edges

	// 	let edgesArray = Array.from(edges);
	// 	let edgesDeck = new Tombola().deck(edgesArray)
	// 	console.log('finding new plot')

	// 	if (edgesDeck.contents.length > 0) {
	// 		let edge = edgesDeck.draw()
	// 		console.log(edge.connectingNodes)
	// 		let availableHouse = edge.getAvailableHouse()
	// 		if (availableHouse) {
	// 			console.log('house found')
	// 			return availableHouse
	// 		} else {
	// 			console.log('No house found')
	// 			let connectingNodesDeck = new Tombola().deck( edge.connectingNodes )
	// 			let connectingNode = connectingNodesDeck.draw()
	// 			console.log('Connecting Node Edge Set: ', connectingNode.edgeSet)
	// 			let connectingEdgesDeck = new Tombola().deck( Array.from(connectingNode.edgeSet) )
	// 			console.log('Connecting Edges Set: ', connectingEdgesDeck)

	// 			let connectedEdge = connectingEdgesDeck.draw()

	// 			while (connectedEdge.getEdgeVacancies == 0) {
	// 				connectedEdge = connectingEdgesDeck.draw()
	// 			}

	// 			let house = connectedEdge.getAvailableHouse()

	// 			while (!house) {
	// 				console.log('Getting another house')
	// 				house = connectedEdge.getAvailableHouse()
	// 			}

				
	// 			return house
	// 		}
	// 	} else {
	// 		this.createRandomNode()
	// 	}
	// }

	getRandomFreePlot = (anniversaryNode) => {
		if(anniversaryNode.availableHousesDeck.contents.length == 0){
			this.initSuburb(anniversaryNode);
			return anniversaryNode.availableHousesDeck.draw();
		}
		else{
			return anniversaryNode.availableHousesDeck.draw()
		}
	}

	//updates the node on it's available houses (spreads out wider as they fill up)
	initSuburb = (anniversaryNode) => {
		// Get all connecting edges as a Set
		let centralNodes = [];
		let loopingNodes = [anniversaryNode];
		while (centralNodes.length == 0){
			let addedNode = false;
			for (var node of loopingNodes){
				if (node.getNodeVacancies().length > 0){
					centralNodes.push(node);
					addedNode = true;
				}
			} 
			//if we didn't find any nodes with vacant land, we need to expand our nodes
			if (!addedNode){
				var newLoopingNodes = []
				for (var node of loopingNodes){
					newLoopingNodes.push(...Array.from(node.getConnectedNodes()));
				} 
				loopingNodes = newLoopingNodes;
			}
		}
		// Iterate over each edge and place available houses into a Deck
		let housesArray = [];

		for (var centralNode of centralNodes) {
			housesArray.push(...centralNode.getNodeVacancies());
		}

		let housesDeck = new Tombola().deck(housesArray)
		anniversaryNode.availableHousesDeck = housesDeck;
		console.log(housesDeck)
	}

	generateNorthNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 270 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateNorthEastNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 315 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateEastNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 360 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateSouthEastNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 45 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateSouthNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 90 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateSouthWestNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 135 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateWestNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 180 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateNorthWestNode = (min, max) => {
		let options = { distance: new Tombola().range(min, max), direction: 225 }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
	}

	generateSocialHub = () => {
		let options = { distance: new Tombola().range(60, 130), direction: 225, nodeType: 'hub' }
		let selectedNode = this.nodeDeck.draw()
		let result = selectedNode.createEdge(options)
		this.nodeDeck.insert(result.newNode)
		this.nodes.add(result.newNode)
		this.socialHubs.add(result.newNode)
	}

	initPopulation = (populationSize) => {
		let nodesArray = Array.from(this.nodes)

		for (var i = 0; i < populationSize; i++) {
			let randomIndex = Math.floor(Math.random() * nodesArray.length)
			var bot = new Single(this.stage, nodesArray[randomIndex], {});
			this.bots.add(bot)
		}
	}

	initCouple = (populationSize) => {
		let nodesArray = Array.from(this.nodes)

		for (var i = 0; i < populationSize; i++) {
			let randomIndex = Math.floor(Math.random() * nodesArray.length)
			var couple = new Couple(_viewport, girlBot, boyBot);
			this.bots.add(couple)
		}
	}
}

module.exports = Map
