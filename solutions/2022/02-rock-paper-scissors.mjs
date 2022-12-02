import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const rounds = _.compact((await fetchInputForDay(2, 2022)).split('\n'))
    .map(round => round.split(' '))
    .map(round => [round[0].charCodeAt(0) - 65, round[1].charCodeAt(0) - 88])

  function score(a, b) {
    return [3, 6, 0][(b - a + 3) % 3]
  }

  const points1 = rounds.map(round => round[1] + score(round[0], round[1]) + 1)
  console.log('Answer, part 1:', _.sum(points1))

  const responses = rounds.map(round => (round[0] + round[1] + 2) % 3)
  const points2 = rounds.map((round, i) => responses[i] + score(round[0], responses[i]) + 1)
  console.log('Answer, part 2:', _.sum(points2))
}
