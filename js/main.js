import Ticker from './Ticker'
import Single from './Single.js';
import Couple from './Couple.js';
import { ease } from 'pixi-ease'
import DomEase from 'dom-ease'
import { State } from 'pixi.js';
import RootState from './RootState.js';

const PIXI = require('pixi.js')
const Viewport = require('pixi-viewport').Viewport
const Node = require('./Node')
const Map = require('./Map')
const BORDER = 10
const WIDTH = 3000
const HEIGHT = 3000
const OBJECT_SIZE = 50
const OBJECT_ROTATION_TIME = 1000
const FADE_TIME = 2000

let _application, _viewport, _object, _stars = [], domEase

function viewport()
{
    _viewport = _application.stage.addChild(new Viewport(
    {
        interaction: _application.renderer.plugins.interaction,
        passiveWheel: false,
    }))
    _viewport
        .drag({ clampWheel: true })
        .wheel({ smooth: 3, percent: 0.2 })
        .pinch()
        .decelerate()
        .on('clicked', click)
    resize()

    domEase = new DomEase({ duration: FADE_TIME })
    ease.duration = FADE_TIME
}

function resize()
{
    _application.renderer.resize(window.innerWidth, window.innerHeight)
    _viewport.resize(window.innerWidth, window.innerHeight, WIDTH, HEIGHT)
}

function border()
{
    const line = _viewport.addChild(new PIXI.Graphics())
    line.lineStyle(10, 0xff0000).drawRect(0, 0, _viewport.worldWidth, _viewport.worldHeight)
}

function object()
{
    _object = _viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    // _object.anchor.set(0.5)
    // _object.tint = 0
    // _object.width = _object.height = OBJECT_SIZE
    // _object.position.set(100, 100)
    // ease.add(_object, { rotation: Math.PI * 2 }, { duration: OBJECT_ROTATION_TIME, repeat: true, ease: 'linear' })
}

function click(data)
{   
    const sprite = _viewport.addChild(new PIXI.Text(String([Math.round(data.world.x, 2), Math.round(data.world.y, 2)]), { fill: 0xff0000 }))
    sprite.anchor.set(0.5)
    sprite.position = data.world
    const fade = ease.add(sprite, { alpha: 0 })
    fade.on('done', () => _viewport.removeChild(sprite))
}

function drawWorld()
{
    ease.removeAll()
    _viewport.removeChildren()
    object()
    _viewport.moveCenter(0, 0)
}

window.onload = function()
{
    _application = new PIXI.Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio})
    document.getElementById("canvas").appendChild(_application.view)
    _application.view.style.position = 'fixed'
    _application.view.style.width = '100vw'
    _application.view.style.height = '100vh'

    viewport()

    window.addEventListener('resize', resize)

    drawWorld()

    // border()

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }

    let m = new Map(_viewport)
    RootState.map = m;
    // let a = m.createNode(300, 300, {sourceNode: m.source })
    // let b = m.createNode(600, 600, {sourceNode: a})
    // let c = m.createNode(500, 300, {sourceNode: b})
    // let d = m.createNode(400, 250, {sourceNode: c})
    // console.log(m.pathFinder.pathTo(m.source, d))

    // m.drawLine()


    // m.generateNorthNode(100, 100)
    // m.generateEastNode(100, 100)
    // m.generateSouthNode(100, 100)
    // m.generateSouthNode(100, 100)
    // m.generateEastNode(100, 100)
    // m.generateSouthNode(100, 100)
    // m.generateWestNode(100, 100)
    // m.generateWestNode(100, 100)
    // m.generateWestNode(100, 100)
    // m.generateWestNode(100, 100)
    // m.generateNorthNode(100, 100)
    // m.generateEastNode(100, 100)
    // m.generateNorthNode(100, 100)
    // m.generateNorthNode(100, 100)
    // m.generateWestNode(100, 100)
    // m.generateNorthNode(100, 100)
    // m.generateEastNode(100, 100)
    // m.generateEastNode(100, 100)
    // m.generateEastNode(100, 100)

    const ticker = new Ticker(m)

    // window.setInterval(function(){
    //     m.createRandomNode()
    //   }, 100 )
    for (let i=0; i<15; i++) {
        m.createRandomNode()
    }


    // let a = new Node(_viewport, {posX: 100, posY: -100})
    // a.createRandomEdge({ distance: 100 })

    // highlight()
    
    let node = m.source //don't push
    // let node2 = Array.from(node.getConnectedNodes())[0];

    // var girlBot = new Single(_viewport, node, {age: 59});

    m.generateSocialHub();

    m.initPopulation(5)

    // let socialHubs = Array.from(m.socialHubs)

    // girlBot.moveToNode(socialHubs[0])
    // window.setInterval(function(){
    //     girlBot.tick()
    //   }, 100 )

    // for (let bot of m.bots) {
    //     bot.wait(Math.floor(Math.random()*10000))
    //     bot.moveToNode(socialHubs[0])
    // }

    
    // var boyBot = new Single(_viewport, node2, {age: 19});
    // m.bots.add(girlBot);
    // m.bots.add(boyBot);
    // girlBot.targetIdentity = [boyBot.identity];
    // boyBot.targetIdentity = [girlBot.identity];
    // // girlBot.identity = [""];
    // // boyBot.identity = [""];
    // console.log("boy identity: " + boyBot.identity);
    // console.log("girl identity: " + girlBot.identity);
    // // console.log("boy target identity: " + boyBot.identity);
    // console.log("girl target identity: " + girlBot.identity);

	//var couple = new Couple(_viewport, girlBot, boyBot);
	// m.botSet.add(couple)

        // window.setInterval(function(){
        //     if(girlBot.alive){
        //         console.log("proposal: " + girlBot.propose(boyBot));
        //     }
        // }, 5000)
  
    

}

// const colours = new Colours();

// girlBot.personality = "GP";
// girlBot.looks = "GL";
// boyBot.personality = "BP";
// boyBot.looks = "BL";
// girlBot.targetPersonality = ["BP"];
// girlBot.targetLooks = ["BL"];
// boyBot.targetPersonality = ["GP"];
// boyBot.targetLooks = ["GL"];

// console.log(girlBot.propose(boyBot));
// console.log(girlBot.relationship.haveSex());
