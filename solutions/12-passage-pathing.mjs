import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(12)).split('\n')).map(l => l.split('-'))
  const graph = new Map()
  input.forEach(([from, to]) => {
    if (!graph.has(from)) graph.set(from, [])
    if (!graph.has(to)) graph.set(to, [])
    graph.get(from).push(to)
    graph.get(to).push(from)
  })

  function hasVisitedSmallCaveTwice(path) {
    const smallCaves = path.filter(x => /^[a-z]+$/.test(x))
    return new Set(smallCaves).size < smallCaves.length
  }
  
  function findPaths(path, canInclude) {
    const last = path[path.length - 1]
    if (last === 'end') return 1

    return _.sum(graph.get(last)
      .filter(x => !/^start$/.test(x))
      .filter(x => canInclude(path, x))
      .map(x => findPaths([...path, x], canInclude)))
  }

  console.log('Answer, part 1:', findPaths(['start'], (path, x) => /^[A-Z]+$/.test(x) || !path.includes(x)))
  console.log('Answer, part 2:', findPaths(['start'], (path, x) => !hasVisitedSmallCaveTwice(path) || /^[A-Z]+$/.test(x) || !path.includes(x)))
}
