import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const rounds = _.compact((await fetchInputForDay(2, 2022)).split('\n'))
    .map(round => round.split(' '))
    .map(round => [round[0].charCodeAt(0) - 65, round[1].charCodeAt(0) - 88])

  const score = [3, 6, 0]
  const points1 = rounds.map(round => round[1] + score[(round[1] - round[0] + 3) % 3] + 1)
  console.log('Answer, part 1:', points1.reduce((a, b) => a + b, 0))

  const responses = rounds.map(round => (round[0] + round[1] + 2) % 3)
  const points2 = rounds.map((round, i) => responses[i] + score[(responses[i] - round[0] + 3) % 3] + 1)
  console.log('Answer, part 2:', points2.reduce((a, b) => a + b))
}
