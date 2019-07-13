import * as PIXI from 'pixi.js'
import { Ease, ease } from 'pixi-ease'

const app = new PIXI.Application()
const test = app.stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
test.tint = 0x00ff00

const example = ease.add(test, { x: 20, y: 15, alpha: 0.25, rotation: 20, scale: 5, skewX: 0.25, blend: 0xff0000 } , { reverse: true, duration: 2500, ease: 'easeInOutQuad' })
example.on('each', () => console.log('ease updated object during frame using PIXI.Ticker.'))
example.once('complete', () => console.log('move ease complete.'))

test.generic = 25
const generic = ease.add(test, { generic: 0 }, { duration: 1500, ease: 'easeOutQuad' })
generic.on('each', () => console.log(test.generic))

const secondEase = new Ease({ duration: 3000, wait: 1500, ease: 'easeInBack', repeat: 3 })
const test2 = app.stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
secondEase.add(test2, { tint: [0xff0000, 0x00ff00, 0x000ff], scaleX: 2 })

document.body.appendChild(app.view);