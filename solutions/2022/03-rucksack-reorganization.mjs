import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const rucksacks = _.compact((await fetchInputForDay(3, 2022)).split('\n')).map(items => [...items])

  function priority(item) {
    const charCode = item.charCodeAt(0)
    return charCode < 97 ? charCode - 38 : charCode - 96
  }

  const part1 = _(rucksacks)
    .map(items => _.intersection(items.slice(0, items.length / 2), items.slice(items.length / 2))[0])
    .map(priority)
    .sum()
  console.log('Answer, part 1:', part1)

  const part2 = _(rucksacks)
    .chunk(3)
    .map(sacks => _.intersection(...sacks)[0])
    .map(priority)
    .sum()
  console.log('Answer, part 2:', part2)
}
