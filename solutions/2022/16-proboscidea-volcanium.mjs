import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const valves = _.compact((await fetchInputForDay(16, 2022)).split('\n'))
    .map(line => {
      const match = /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)$/.exec(line)
      return {
        name: match[1],
        rate: Number(match[2]),
        links: match[3].split(/\W+/),
      }
    })

  valves.forEach(valve => valve.links = valve.links.map(name => valves.find(v => v.name === name)))
  valves.forEach(valve => valve.shortestPaths = findShortestPaths(valve))
  const startValve = valves.find(v => v.name === 'AA')
  const nonZeroValves = valves.filter(v => v.rate > 0)

  function findShortestPaths(fromValve) {
    let level = 1
    let levelValves = [...fromValve.links]
    const shortestPaths = new Map()
    do {
      levelValves.filter(v => !shortestPaths.has(v)).forEach(v => shortestPaths.set(v, level))
      levelValves = levelValves.flatMap(v => v.links).filter(v => v !== fromValve && !shortestPaths.has(v))
      level += 1
    } while (shortestPaths.size < valves.length - 1)

    return shortestPaths
  }

  function maxPressure(currentValve, timeRemaining, remainingValves, hasElephant) {
    return _.sum(remainingValves.map(v => {
      let timeOpen = timeRemaining - currentValve.shortestPaths.get(v) - 1
      if (hasElephant) {
        timeOpen = Math.max(timeOpen, 25 - startValve.shortestPaths.get(v))
      }
      return v.rate * Math.max(0, timeOpen)
    }))
  }

  let bestResult = 0
  function search(hasElephant, isElephant, order, totalPressure, timeRemaining, remainingValves) {
    const currentValve = order[order.length - 1]
    const distances = remainingValves.map(v => currentValve.shortestPaths.get(v))
    if (remainingValves.length === 0 || timeRemaining < _.min(distances) + 2) {
      if (hasElephant && !isElephant) {
        search(true, true, [startValve], totalPressure, 26, remainingValves)
      } else {
        bestResult = Math.max(bestResult, totalPressure)
      }
      return
    }
    let maxRemainingPressure = maxPressure(currentValve, timeRemaining, remainingValves, hasElephant && !isElephant)
    if (totalPressure + maxRemainingPressure < bestResult) return

    for (const valve of remainingValves) {
      const newTimeRemaining = timeRemaining - currentValve.shortestPaths.get(valve) - 1
      if (newTimeRemaining > 0) {
        const newTotalPressure = totalPressure + valve.rate * newTimeRemaining
        const newRemainingValves = remainingValves.filter(v => v !== valve)
        search(hasElephant, isElephant, [...order, valve], newTotalPressure, newTimeRemaining, newRemainingValves)
      }
    }
  }

  search(false, false, [startValve], 0, 30, nonZeroValves)
  console.log('Answer, part 1:', bestResult)

  bestResult = 0
  search(true, false, [startValve], 0, 26, nonZeroValves)
  console.log('Answer, part 2:', bestResult)
}
