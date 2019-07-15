class Ticker {
    constructor(map) {
        this.map = map
        // Set timeSpeed to a high number to slow down the simulation.
        this.tickSpeed = 100
        this.counter = 0
        this.intervalId = this.startTicker()
    }

    tick = () => {
        for (let bot of this.map.bots) {
            if (bot.alive) {
                bot.tick()
            }
        }
    }

    startTicker = () => {
        window.setInterval(
            this.tick.bind(this), this.tickSpeed
        )
    }

    stopTicker = (intervalId) => {
        window.clearInterval(intervalId)
    }
}

module.exports = Ticker;
