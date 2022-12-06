import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const signal = _.compact((await fetchInputForDay(6, 2022)).split('\n')[0].split(''))

  const part1 = signal.findIndex((v, i) => i > 3 && new Set(signal.slice(i - 4, i)).size === 4)
  console.log('Answer, part 1:', part1)

  const part2 = signal.findIndex((v, i) => i > 13 && new Set(signal.slice(i - 14, i)).size === 14)
  console.log('Answer, part 2:', part2)
}
