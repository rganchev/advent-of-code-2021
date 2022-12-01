import _ from 'lodash'
import { fetchInputForDay } from '../../input.mjs'

export async function solve() {
  const input = _.compact((await fetchInputForDay(2)).split('\n'))

  const [horiz, vert] = _.partition(input, dir => dir.startsWith('forward'))
  const horizSum = _.sum(horiz.map(h => Number(h.substring(8))))
  const vertSum = _.sum(vert.map(v => Number(v.replace(/^down /, '').replace(/^up /, '-'))))
  console.log('Answer, part 1:', horizSum * vertSum)

  let adjustedVertSum = 0
  let aim = 0
  for (const instruction of input) {
    if (instruction.startsWith('forward')) {
      adjustedVertSum += Number(instruction.substring(8)) * aim
    } else {
      aim += Number(instruction.replace(/^down /, '').replace(/^up /, '-'))
    }
  }
  console.log('Answer, part 2:', horizSum * adjustedVertSum)
}
