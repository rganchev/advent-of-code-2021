import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const depths = _.compact((await fetchInputForDay(1)).split('\n')).map(Number)

  console.log('Answer, part 1:', depths.filter((depth, i) => i > 0 && depth > depths[i - 1]).length)
  console.log('Answer, part 2:', depths.filter((depth, i) => i > 2 && depth > depths[i - 3]).length)
}
