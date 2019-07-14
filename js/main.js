import Bot from './Bot.js';
import Colours from './Colours.js';
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
    _object.anchor.set(0.5)
    _object.tint = 0
    _object.width = _object.height = OBJECT_SIZE
    _object.position.set(100, 100)
    ease.add(_object, { rotation: Math.PI * 2 }, { duration: OBJECT_ROTATION_TIME, repeat: true, ease: 'linear' })
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

    window.setInterval(function(){
        m.createRandomNode()
      }, 10000)

    // let a = new Node(_viewport, {posX: 100, posY: -100})
    // a.createRandomEdge({ distance: 100 })

    // highlight()

    const colours = new Colours();
    var girlBot = new Bot(_viewport,{age: 59,posX:100,posY:100});
    var boyBot = new Bot(_viewport,{age: 19,posX:-100,posY:-100});
}



// const colours = new Colours();
// var girlBot = new Bot(_viewport,{age: 59,posX:10,posY:10});
// var boyBot = new Bot(_viewport,{age: 19,posX:-10,posY:-10});
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
