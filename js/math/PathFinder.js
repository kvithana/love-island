const _ = require('underscore')
const PriorityQueue = require('../javascript-algorithms/data-structures/priority-queue/PriorityQueue.js').default;

function setDefaults(options, defaults){
    return _.defaults({}, _.clone(options), defaults)
}

class PathFinder {
    constructor(options) {
        let defaults = {
            nodeSet: null,
            edgeSet: null,
            hubSet: null
        }
        this.nodes = {}
        options = setDefaults(options, defaults)
        this.nodeSet = options.nodeSet
        this.edgeSet = options.edgeSet
        this.hubSet = options.hubSet
    }

    pathTo = (source, destination) => {
        let distances = new Map()
        let previousVerticies = new Map()
        let visited = new Map()
        let queue = new PriorityQueue()
        
        for (const node of this.nodeSet) {
            distances.set(node, Infinity);
            previousVerticies.set(node, null);
        }

        distances.set(source, 0);

        queue.add(source, distances.get(source))

        let currentNode
        while (!queue.isEmpty()) {
            currentNode = queue.poll()

            Array.from(currentNode.getConnectedNodes()).forEach( (neighbour) => {
                if (!visited.get(neighbour)) {
                    const existingDistance = distances.get(neighbour)
                    const newDistance = distances.get(currentNode) + 1
                    if (newDistance < existingDistance) {
                        distances.set(neighbour, newDistance)

                        if (queue.hasValue(neighbour)) {
                            queue.changePriority(neighbour, distances.get(neighbour))
                        }
                        previousVerticies.set(neighbour, currentNode)
                    }
                    if (!queue.hasValue(neighbour)) {
                        queue.add(neighbour, distances.get(neighbour))
                    }
                }
            })
            visited.set(currentNode, currentNode)
            if (currentNode == destination) {
                let result = []
                let current = currentNode
                while (current != source) {
                    current = previousVerticies.get(current)
                    result.push(current)
                }
                result.reverse()
                return result
            }
        }
        // let result = []
        // let current = currentNode
        // result.push(current)
        // while (current != source) {
        //     current = previousVerticies[current]
        //     result.push(current)
        // }
        // result.reverse()
        // return result
    }

}


// export default function dijkstra(graph, startVertex) {
//     // Init helper variables that we will need for Dijkstra algorithm.
//     const distances = {};
//     const visitedVertices = {};
//     const previousVertices = {};
//     const queue = new PriorityQueue();
  
//     // Init all distances with infinity assuming that currently we can't reach
//     // any of the vertices except the start one.
//     graph.getAllVertices().forEach((vertex) => {
//       distances[vertex.getKey()] = Infinity;
//       previousVertices[vertex.getKey()] = null;
//     });
  
//     // We are already at the startVertex so the distance to it is zero.
//     distances[startVertex.getKey()] = 0;
  
//     // Init vertices queue.
//     queue.add(startVertex, distances[startVertex.getKey()]);
  
//     // Iterate over the priority queue of vertices until it is empty.
//     while (!queue.isEmpty()) {
//       // Fetch next closest vertex.
//       const currentVertex = queue.poll();
  
//       // Iterate over every unvisited neighbor of the current vertex.
//       currentVertex.getNeighbors().forEach((neighbor) => {
//         // Don't visit already visited vertices.
//         if (!visitedVertices[neighbor.getKey()]) {
//           // Update distances to every neighbor from current vertex.
//           const edge = graph.findEdge(currentVertex, neighbor);
  
//           const existingDistanceToNeighbor = distances[neighbor.getKey()];
//           const distanceToNeighborFromCurrent = distances[currentVertex.getKey()] + edge.weight;
  
//           // If we've found shorter path to the neighbor - update it.
//           if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
//             distances[neighbor.getKey()] = distanceToNeighborFromCurrent;
  
//             // Change priority of the neighbor in a queue since it might have became closer.
//             if (queue.hasValue(neighbor)) {
//               queue.changePriority(neighbor, distances[neighbor.getKey()]);
//             }
  
//             // Remember previous closest vertex.
//             previousVertices[neighbor.getKey()] = currentVertex;
//           }
  
//           // Add neighbor to the queue for further visiting.
//           if (!queue.hasValue(neighbor)) {
//             queue.add(neighbor, distances[neighbor.getKey()]);
//           }
//         }
//       });
  
//       // Add current vertex to visited ones to avoid visiting it again later.
//       visitedVertices[currentVertex.getKey()] = currentVertex;
//     }

module.exports = PathFinder

