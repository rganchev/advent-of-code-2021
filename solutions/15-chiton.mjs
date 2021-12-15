import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(15)).split('\n')).map(line => line.split('').map(Number))

  function dijkstra(input) {
    const graph = new Uint32Array(input.flatMap(line => line))
    const size = input.length
    const minDistances = new Uint32Array(graph.length).fill(1 << 31)
    const unvisited = new Set(_.times(graph.length - 1, i => i + 1))
  
    function adj(x) {
      const adjacent = []
      if (x >= size) adjacent.push(x - size)
      if (x < graph.length - size) adjacent.push(x + size)
      if (x % size > 0) adjacent.push(x - 1)
      if (x % size < size - 1) adjacent.push(x + 1)
      return adjacent
    }
  
    let current = 0
    minDistances[0] = 0
    while (current !== graph.length - 1) {
      adj(current).forEach(i => minDistances[i] = Math.min(minDistances[i], minDistances[current] + graph[i]))
      unvisited.delete(current)
      current = _.minBy([...unvisited], i => minDistances[i])
    }

    return minDistances[current]
  }

  console.log('Answer, part 1:', dijkstra(input))
  
  const tiledInput = _.times(5, i => input.map(line => _.times(5, j => line.map(x => (x - 1 + i + j) % 9 + 1)).flatMap(line => line))).flatMap(tile => tile)
  // Need a more efficient implementation. Dijkstra is very slow on the larger input, but still
  // manages to complete in ~10 minutes.
  console.log('Answer, part 2:', dijkstra(tiledInput))
}
