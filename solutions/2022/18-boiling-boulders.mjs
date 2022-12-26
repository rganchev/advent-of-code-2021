import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const cubes = _.compact((await fetchInputForDay(18, 2022)).split('\n'))
    .map(line => line.split(',').map(Number))

  const space = _.times(
    _.max(cubes.map(c => c[0])) + 3,
    () => _.times(
      _.max(cubes.map(c => c[1])) + 3,
      () => new Array(_.max(cubes.map(c => c[2])) + 3).fill(1)
    )
  )
  cubes.forEach(([x, y, z]) => space[x + 1][y + 1][z + 1] = 0)

  function neighbours(x, y, z) {
    const nbrs = [[x-1, y, z], [x+1, y, z], [x, y-1, z], [x, y+1, z], [x, y, z-1], [x, y, z+1]]
    return nbrs.filter(([x, y, z]) => x >= 0 && x < space.length && y >= 0 && y < space[0].length && z >= 0 && z < space[0][0].length)
  }

  function countSides(condition) {
    let nSides = 0
    for (let x = 1; x < space.length - 1; x += 1) {
      for (let y = 1; y < space[0].length - 1; y += 1) {
        for (let z = 1; z < space[0][0].length - 1; z += 1) {
          if (space[x][y][z] === 0) {
            nSides += neighbours(x, y, z).filter(condition).length
          }
        }
      }
    }
    return nSides
  }

  console.log('Answer, part 1:', countSides(([x, y, z]) => space[x][y][z] === 1))

  const q = [[0, 0, 0]]
  space[0][0][0] = 2
  while (q.length > 0) {
    const [x, y, z] = q.shift()
    const nbrs = neighbours(x, y, z).filter(([x, y, z]) => space[x][y][z] === 1)
    nbrs.forEach(([x, y, z]) => space[x][y][z] = 2)
    q.push(...nbrs)
  }
  console.log('Answer, part 2:', countSides(([x, y, z]) => space[x][y][z] === 2))
}
