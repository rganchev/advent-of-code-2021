import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export class Heap {
  constructor(elements) {
    this.elements = new Array()
    this.indexMap = new Map()
    elements.forEach(element => this.add(element))
  }

  takeMin() {
    this._swap(0, this.elements.length - 1)
    const min = this.elements.pop()
    this.indexMap.delete(min.id)
    this._sink(0)
    return min
  }

  has(id) {
    return this.indexMap.has(id)
  }

  getWeight(id) {
    return this.elements[this.indexMap.get(id)].weight
  }

  add({ id, weight }) {
    this.elements.push({ id, weight })
    this.indexMap.set(id, this.elements.length - 1)
    this._float(this.elements.length - 1)
  }

  update({ id, weight }) {
    const index = this.indexMap.get(id)
    this.elements[index].weight = weight
    if (!this._float(index)) this._sink(index)
  }

  _float(index) {
    let current = index
    while (current > 0 && this.elements[current].weight < this.elements[Math.floor(current / 2)].weight) {
      const parent = Math.floor(current / 2)
      this._swap(current, parent)
      current = parent
    }
    return current !== index
  }

  _sink(index) {
    let current = index
    while (2 * current < this.elements.length) {
      const children = [2 * current]
      if (2 * current + 1 < this.elements.length) children.push(2 * current + 1)
      const smallestChild = _.minBy(children, i => this.elements[i].weight)

      if (this.elements[current].weight > this.elements[smallestChild].weight) {
        this._swap(current, smallestChild)
        current = smallestChild
      } else {
        break
      }
    }
    return current !== index
  }

  _swap(i, j) {
    const buffer = this.elements[i]
    this.elements[i] = this.elements[j]
    this.elements[j] = buffer
    this.indexMap.set(this.elements[i].id, i)
    this.indexMap.set(this.elements[j].id, j)
  }
}

export async function solve() {
  const input = _.compact((await fetchInputForDay(15)).split('\n')).map(line => line.split('').map(Number))

  function dijkstra(input) {
    const graph = input.flatMap(line => line)
    const size = input.length
    const distances = new Heap(graph.map((_, i) => ({ id: i, weight: Infinity })))

    function adj(x) {
      const adjacent = []
      if (x >= size) adjacent.push(x - size)
      if (x < graph.length - size) adjacent.push(x + size)
      if (x % size > 0) adjacent.push(x - 1)
      if (x % size < size - 1) adjacent.push(x + 1)
      return adjacent
    }

    distances.update({ id: 0, weight: 0 })
    let current
    do {
      current = distances.takeMin()
      adj(current.id)
        .filter(i => distances.has(i))
        .forEach(i => distances.update({ id: i, weight: Math.min(distances.getWeight(i), current.weight + graph[i]) }))
    } while (current.id !== graph.length - 1)

    return current.weight
  }

  console.log('Answer, part 1:', dijkstra(input))

  const tiledInput = _.times(5, i => input.map(line => _.times(5, j => line.map(x => (x - 1 + i + j) % 9 + 1)).flatMap(line => line))).flatMap(tile => tile)
  console.log('Answer, part 2:', dijkstra(tiledInput))
}
