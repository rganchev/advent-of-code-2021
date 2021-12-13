import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const distances = _.compact((await fetchInputForDay(7)).split(',')).map(Number)
  distances.sort((a, b) => a - b)
  const median = distances[Math.floor(distances.length / 2)]
  console.log('Answer, part 1:', distances.reduce((s, x) => s + Math.abs(median - x), 0))

  const mean = _.mean(distances)
  const p = distances.filter(x => x < mean).length / distances.length
  const split = Math.round(mean + 0.5 - p)
  console.log('Answer, part 2:', _.sum(distances.map(x => Math.abs(split - x)).map(d => 0.5 * d * (d + 1))))
}
