import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const pairs = _.compact((await fetchInputForDay(4, 2022)).split('\n'))
    .map(pair => pair.split(','))
    .map(([a, b]) => [a.split('-').map(Number), b.split('-').map(Number)])

  function fullyContains([a, b]) {
    return (a[1] - b[1]) * (b[0] - a[0]) >= 0
  }

  console.log('Answer, part 1:', pairs.filter(fullyContains).length)

  function overlaps([a, b]) {
    return !(a[1] < b[0] || a[0] > b[1])
  }
  console.log('Answer, part 2:', pairs.filter(overlaps).length)
}
