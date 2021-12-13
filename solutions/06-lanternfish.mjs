import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const days = _.compact((await fetchInputForDay(6)).split(',')).map(Number)
  const counts = new Array(9).fill(0)
  days.forEach(day => counts[day]++)
  for (let day = 0; day < 256; day++) {
    let finished = counts[0]
    for (let i = 0; i < counts.length - 1; i++) {
      counts[i] = counts[i + 1]
    }
    counts[8] = finished
    counts[6] += finished

    if (day === 79) console.log('Answer, part 1:', counts.reduce((a, b) => a + b, 0))
  }
  console.log('Answer, part 2:', counts.reduce((a, b) => a + b, 0))
}
