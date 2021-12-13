import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const numbers = _.compact((await fetchInputForDay(3)).split('\n'))

  const counts = numbers.reduce((counts, num) => {
    for (const i in num) if (num[i] === '1') counts[i]++
    return counts
  }, new Array(numbers[0].length).fill(0))

  const gamma = Number.parseInt(counts.map(c => c > numbers.length / 2 ? '1' : '0').join(''), 2)
  const epsilon = Number.parseInt(counts.map(c => c > numbers.length / 2 ? '0' : '1').join(''), 2)
  console.log('Answer, part 1:', gamma * epsilon)

  let oxy = numbers.slice()
  for (let i = 0; i < oxy[0].length && oxy.length > 1; i++) {
    const count = _.sum(oxy.map(num => Number(num[i])))
    oxy = oxy.filter(num => num[i] === (count >= oxy.length / 2 ? '1' : '0'))
  }

  let co2 = numbers.slice()
  for (let i = 0; i < co2[0].length && co2.length > 1; i++) {
    const count = _.sum(co2.map(num => Number(num[i])))
    co2 = co2.filter(num => num[i] === (count < co2.length / 2 ? '1' : '0'))
  }
  console.log('Answer, part 2:', Number.parseInt(oxy[0], 2) * Number.parseInt(co2[0], 2))
}
