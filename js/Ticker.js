class Ticker {
    constructor(map) {
        this.map = map

        this.intervalId = this.startTicker()
    }

    tick = () => {
        for (let bot of this.map.bots) {
            bot.tick()
        }
    }

    startTicker = () => {
        window.setInterval(
            this.tick.bind(this), 200
        )
    }

    stopTicker = (intervalId) => {
        window.clearInterval(intervalId)
    }
}

module.exports = Ticker;