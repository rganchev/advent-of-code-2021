
import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const rawMap = _.compact((await fetchInputForDay(24, 2022)).split('\n'))
  const map = rawMap.slice(1, -1).map(row => row.slice(1, -1).split(''))
  const colStart = rawMap[0].indexOf('.') - 1
  const colEnd = rawMap[rawMap.length - 1].indexOf('.') - 1

  function encode([i, j]) { return (i << 16) + j }
  function decode(pos) { return [pos >> 16, pos & 0xffff] }

  function blizzardsAtMinute(n) {
    const height = map.length
    const width = map[0].length
    const blizzards = _.times(height, () => new Array(width).fill(false))
    map.forEach((row, i) => row.forEach((x, j) => {
      if (x === '>') blizzards[i][(j + n) % width] = true
      if (x === 'v') blizzards[(i + n) % height][j] = true
      if (x === '<') blizzards[i][((j - n) % width + width) % width] = true
      if (x === '^') blizzards[((i - n) % height + height) % height][j] = true
    }))
    return blizzards
  }

  function possibleMoves([i, j], blizzards, target) {
    if (i === -1 && j === colStart) return blizzards[0][j] ? [[-1, j]] : [[i, j], [0, j]]
    if (i === map.length && j === colEnd) return blizzards[i - 1][j] ? [[i, j]] : [[i, j], [i - 1, j]]

    return [[i, j], [i + 1, j], [i, j + 1], [i - 1, j], [i, j - 1]]
      .filter(move => (move[0] === target[0] && move[1] === target[1]) ||
                      (0 <= move[0] && move[0] < map.length &&
                       0 <= move[1] && move[1] < map[0].length &&
                       !blizzards[move[0]][move[1]]))
  }

  function minMoves(from, to, startMinute) {
    let minute = startMinute
    const encodedEndPos = encode(to)

    let levelPositions = new Set([encode(from)])
    do {
      const blizzards = blizzardsAtMinute(minute + 1)
      levelPositions = new Set([...levelPositions].flatMap(pos => possibleMoves(decode(pos), blizzards, to)).map(encode))
      minute += 1
    } while (!levelPositions.has(encodedEndPos))

    return minute
  }

  const start = [-1, colStart]
  const end = [map.length, colEnd]

  const minutesToEnd = minMoves(start, end, 0)
  console.log('Answer, part 1:', minutesToEnd)

  const minutesToStart = minMoves(end, start, minutesToEnd)
  console.log('Answer, part 2:', minMoves(start, end, minutesToStart))
}
