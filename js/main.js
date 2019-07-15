import Ticker from './Ticker'
import Single from './Single.js';
import Couple from './Couple.js';
import { ease } from 'pixi-ease'
import DomEase from 'dom-ease'

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
    const sprite = _viewport.addChild(new PIXI.Text('click', { fill: 0xff0000 }))
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
    _application = new PIXI.Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio })
    document.getElementById("canvas").appendChild(_application.view)
    _application.view.style.position = 'fixed'
    _application.view.style.width = '100vw'
    _application.view.style.height = '100vh'

    viewport()

    window.addEventListener('resize', resize)

    drawWorld()

    // border()


    let m = new Map(_viewport)

    m.generateNorthNode()
    m.generateEastNode()
    m.generateSouthNode()
    m.generateSouthNode()
    m.generateEastNode()
    m.generateSocialHub()
    m.generateSouthNode()
    m.generateWestNode()
    m.generateWestNode()
    m.generateWestNode()
    m.generateWestNode()
    m.generateSocialHub()
    m.generateNorthNode()
    m.generateEastNode()
    m.generateNorthNode()
    m.generateNorthNode()
    m.generateWestNode()
    m.generateNorthNode()
    m.generateEastNode()
    m.generateEastNode()
    m.generateEastNode()
    m.generateSocialHub()

    m.initPopulation(20)

    const ticker = new Ticker(m)

    window.setInterval(function(){
        m.createRandomNode()
    }, 1000)

    // highlight()
    
    let node = m.source //don't push
    let node2 = Array.from(node.getConnectedNodes())[0];

    var girlBot = new Single(_viewport, node, {age: 59});
    var boyBot = new Single(_viewport, node2, {age: 19});
    m.bots.add(girlBot);
    m.bots.add(boyBot);
    girlBot.targetIdentity = [boyBot.identity];
    boyBot.targetIdentity = [girlBot.identity];
    // // girlBot.identity = [""];
    // // boyBot.identity = [""];
    // console.log("boy identity: " + boyBot.identity);
    // console.log("girl identity: " + girlBot.identity);
    // // console.log("boy target identity: " + boyBot.identity);
    // console.log("girl target identity: " + girlBot.identity);

    //var couple = new Couple(_viewport, girlBot,boyBot);

    window.setInterval(function(){
        if(girlBot.alive){
            console.log("proposal: " + girlBot.propose(boyBot));
        }
        if(girlBot.relationship!=null && girlBot.relationship.alive){
            girlBot.relationship.haveSex();
        }
    }, 1000)
  
    

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
