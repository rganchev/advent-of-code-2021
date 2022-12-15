import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  let rockSegments = _.compact((await fetchInputForDay(14, 2022)).split('\n'))
    .map(segment => segment.split(' -> ').map(point => point.split(',').map(Number)))

  const yMax = _.max(rockSegments.flatMap(segment => segment.map(p => p[1])))
  const map = _.times(yMax + 2, () => new Array(Math.max(500, yMax) + yMax + 2).fill(false))
  rockSegments.forEach(segment => {
    let currentPoint = _.head(segment)
    _.tail(segment).forEach(point => {
      const xDir = Math.sign(point[0] - currentPoint[0])
      const yDir = Math.sign(point[1] - currentPoint[1])
      let [x, y] = currentPoint
      while (x !== point[0] || y !== point[1]) {
        map[y][x] = true
        x += xDir
        y += yDir
      }
      map[y][x] = true
      currentPoint = point
    })
  })

  function pourSand(map, stopWhenReachedBottom) {
    let currentPoint = [500, -1]
    while (true) {
      let xNext = currentPoint[0]
      const yNext = currentPoint[1] + 1
      if (map[yNext][xNext]) {
        xNext -= 1
        if (xNext >= 0 && map[yNext][xNext]) {
          xNext += 2
          if (xNext < map[0].length && map[yNext][xNext]) {
            map[currentPoint[1]][currentPoint[0]] = true
            break
          }
        }
      }
      if (yNext === map.length - 1) {
        if (stopWhenReachedBottom) {
          return false
        } else {
          map[yNext][xNext] = true
          break
        }
      }
      currentPoint = [xNext, yNext]
    }

    return currentPoint[0] !== 500 || currentPoint[1] !== 0
  }


  let nUnitsOfSand = 0
  const mapCopyPart1 = _.cloneDeep(map)
  while (pourSand(mapCopyPart1, true)) nUnitsOfSand += 1
  console.log('Answer, part 1:', nUnitsOfSand)

  nUnitsOfSand = 1
  const mapCopyPart2 = _.cloneDeep(map)
  while (pourSand(mapCopyPart2, false)) nUnitsOfSand += 1
  console.log('Answer, part 2:', nUnitsOfSand)
}
