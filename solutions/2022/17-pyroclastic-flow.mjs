import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'


class Rock {
  constructor(shape) {
    this.shape = shape
  }

  isLeftBlocked(cave, bottom, left) {
    return this.shape.some((row, i) => left === 0 ||
      cave[bottom + this.shape.length - i - 1][left + row.indexOf('#') - 1])
  }

  isRightBlocked(cave, bottom, left) {
    return this.shape.some((row, i) => left + this.shape[0].length === cave[0].length ||
      cave[bottom + this.shape.length - i - 1][left + row.lastIndexOf('#') + 1])
  }

  isBottomBlocked(cave, bottom, left) {
    if (bottom === 0) return true

    for (let j = 0; j < this.shape[0].length; j += 1) {
      let i = this.shape.length - 1
      while (this.shape[i][j] !== '#') i -= 1
      if (cave[bottom + this.shape.length - i - 2][left + j]) return true
    }
    return false
  }

  install(cave, bottom, left) {
    this.shape.forEach((row, i) => row.split('').forEach((x, j) => {
      if (x === '#') cave[bottom + this.shape.length - i - 1][left + j] = true
    }))
  }
}

const shapes = [
  new Rock(['####']),
  new Rock([
    '.#.',
    '###',
    '.#.',
  ]),
  new Rock([
    '..#',
    '..#',
    '###',
  ]),
  new Rock([
    '#',
    '#',
    '#',
    '#',
  ]),
  new Rock([
    '##',
    '##',
  ])
]

export async function solve() {
  const flowPattern = (await fetchInputForDay(17, 2022)).trim().split('').map(c => c === '<' ? -1 : 1)

  function simulateFallingRocks(nRocks) {
    const states = new Map()
    const cave = _.times(10, () => new Array(7).fill(false))
    const isSideBlocked = (shape, bottom, left, dir) =>
      dir < 0 ? shape.isLeftBlocked(cave, bottom, left) : shape.isRightBlocked(cave, bottom, left)

    let pileHeight = 0
    let removed = 0
    let step = 0
    for (let i = 0; i < nRocks; i += 1) {
      const shape = shapes[i % 5]
      let bottom = pileHeight + 3 - removed
      if (cave.length < bottom + 1000) cave.push.apply(cave, _.times(1000, () => new Array(7).fill(false)))

      let left = 2
      while (true) {
        const direction = flowPattern[step % flowPattern.length]
        step += 1
        if (!isSideBlocked(shape, bottom, left, direction)) left += direction
        if (!shape.isBottomBlocked(cave, bottom, left)) bottom -= 1
        else break
      }

      shape.install(cave, bottom, left)

      pileHeight = cave.findIndex(line => line.every(x => !x)) + removed
      const toRemove = cave.findIndex(line => line.every(x => x))
      if (toRemove >= 0) {
        cave.splice(0, toRemove + 1)
        removed += toRemove + 1
        if (pileHeight - removed === 1) {
          const state = `${cave[0].map(x => x ? '#' : '.').join('')}_${shape}_${step % flowPattern.length}`
          if (!states.has(state)) {
            states.set(state, { index: i, pileHeight })
          } else {
            const cycleFrom = states.get(state)
            const cycleLength = i - cycleFrom.index
            const nCycles = Math.floor((nRocks - i - 1) / cycleLength)
            i += nCycles * cycleLength
            const cyclePileHeight = nCycles * (pileHeight - cycleFrom.pileHeight)
            pileHeight += cyclePileHeight
            removed += cyclePileHeight
          }
        }
      }
    }

    return pileHeight
  }

  console.log('Answer, part 1:', simulateFallingRocks(2022))
  console.log('Answer, part 2:', simulateFallingRocks(1000000000000))
}
