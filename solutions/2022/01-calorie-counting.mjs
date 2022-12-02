import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const elves = _.compact((await fetchInputForDay(1, 2022)).split('\n\n')).map(calories => calories.split('\n').map(Number))
  const elfCalories = elves.map(calories => _.sum(calories)).sort((a, b) => b - a)

  console.log('Answer, part 1:', elfCalories[0])
  console.log('Answer, part 2:', elfCalories[0] + elfCalories[1] + elfCalories[2])
}
