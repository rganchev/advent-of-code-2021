import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = (await fetchInputForDay(17)).trim()
  const [minX, maxX, minY, maxY] = /x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/.exec(input).slice(1).map(Number)

  function quadraticSolution(a, b, c) {
    return (-b + Math.sqrt(b*b - 4*a*c)) / (2*a)
  }

  function findIntegerRange(min, max, nSteps) {
    const minStart = min / nSteps + (nSteps - 1) / 2
    const maxStart = max / nSteps + (nSteps - 1) / 2
    return [Math.ceil(minStart), Math.floor(maxStart) + 1]
  }

  const velocities = new Set()
  for (let nSteps = 1; nSteps <= 2 * Math.max(Math.abs(minY), Math.abs(maxY)); nSteps++) {
    const yRange = findIntegerRange(minY, maxY, nSteps)
    const highXRange = findIntegerRange(minX, maxX, nSteps)
    highXRange[0] = Math.max(highXRange[0], nSteps)
    const lowXRange = [Math.ceil(quadraticSolution(1, 1, -2*minX)), Math.floor(quadraticSolution(1, 1, -2*maxX)) + 1]
    lowXRange[1] = Math.min(lowXRange[1], nSteps - 1)

    _.range(...yRange, 1).forEach(y => {
      _.range(...lowXRange, 1).forEach(x => velocities.add((y << 16) + x))
      _.range(...highXRange, 1).forEach(x => velocities.add((y << 16) + x))
    })
  }

  const maxYVelocity = _.max([...velocities].map(v => (v >> 16)))
  console.log('Answer, part 1:', 0.5 * maxYVelocity * (maxYVelocity + 1))
  console.log('Answer, part 2:', velocities.size)
}
