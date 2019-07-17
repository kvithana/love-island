class Helper{
    constructor() {}
    calculateAngleFromNodes = (sourceNode , destNode) => {
        return Math.atan2(destNode.position.posY - sourceNode.position.posY,
            destNode.position.posX - sourceNode.position.posX) * 180 / Math.PI
    }
    
    calculateDistanceFromNodes = (sourceNode, destNode) => {
        return Math.hypot( destNode.position.posX - sourceNode.position.posX, destNode.position.posY - sourceNode.position.posY )
    }

    isAngleOkay = (node, destNode) => {
        let angle = this.calculateAngleFromNodes(destNode, node)
        let destAngles = destNode.getEdgeAngles()
        console.log(angle, destNode, destAngles)
        for (const edgeAngle of destAngles) {
            if (Math.abs(angle - edgeAngle) < 45) {
                console.log(Math.abs(angle - edgeAngle) < 20)
                return false
            }
        } 
        return true
    }
}

module.exports = Helper