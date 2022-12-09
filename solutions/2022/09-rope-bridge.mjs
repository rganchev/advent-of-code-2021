import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const directions = { U: [-1, 0], R: [0, 1], D: [1, 0], L: [0, -1] }
  const moves = _.compact((await fetchInputForDay(9, 2022)).split('\n'))
    .map(m => m.split(' '))
    .flatMap(([dir, steps]) => new Array(Number(steps)).fill(directions[dir]))

  function simulateRopeMovement(tailLenght) {
    const rope = _.times(tailLenght + 1, () => [0, 0])
    const tailPositions = new Set([0])
    const lastKnot = _.last(rope)
    moves.forEach(([iStep, jStep]) => {
      rope[0][0] += iStep
      rope[0][1] += jStep
      for (let i = 1; i < rope.length; i++) {
        const di = rope[i - 1][0] - rope[i][0]
        const dj = rope[i - 1][1] - rope[i][1]
        if (Math.abs(di) > 1 || Math.abs(dj) > 1) {
          rope[i][0] += Math.abs(di) > 0 ? di / Math.abs(di) : 0
          rope[i][1] += Math.abs(dj) > 0 ? dj / Math.abs(dj) : 0
        }
      }
      tailPositions.add(lastKnot[0] * 100000 + lastKnot[1])
    })

    return tailPositions.size
  }

  console.log('Answer, part 1:', simulateRopeMovement(1))
  console.log('Answer, part 2:', simulateRopeMovement(9))
}
