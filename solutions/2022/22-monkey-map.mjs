
import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const [mapInput, movesInput] = (await fetchInputForDay(22, 2022)).split('\n\n')

  const map = mapInput.split('\n').map(row => row.split('').map(x => x.trim()))
  const moves = _.compact(movesInput.trim().split(/((?<=\d)(?=[RL])|(?<=[RL])(?=\d))/))
    .map(val => /\d/.test(val) ? Number(val) : val)

  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]

  function part1() {
    let dirIndex = 0
    let pos = [0, map[0].indexOf('.')]

    moves.forEach(move => {
      if (Number.isFinite(move)) {
        const dir = directions[dirIndex]
        for (let i = 0; i < move; i += 1) {
          let nextPos = pos
          do {
            nextPos = [
              (nextPos[0] + dir[0] + map.length) % map.length,
              (nextPos[1] + dir[1] + map[0].length) % map[0].length
            ]
          } while (!map[nextPos[0]][nextPos[1]])

          if (map[nextPos[0]][nextPos[1]] === '#') break
          pos = nextPos
        }
      } else {
        const dirChange = move === 'R' ? 1 : -1
        dirIndex = (dirIndex + dirChange + directions.length) % directions.length
      }
    })

    return (pos[0] + 1) * 1000 + (pos[1] + 1) * 4 + dirIndex
  }

  console.log('Answer, part 1:', part1())

  const sides = []
  let i = 0, j = 0
  _.times(12, () => {
    if (map[i][j]) sides.push(map.slice(i, i + 50).map(row => row.slice(j, j + 50)))

    if (j < 100) { j += 50 }
    else { i += 50; j = 0 }
  })

  // TODO: Determine automatically from input
  const edges = [
    [[0, 'right'], [1, 'left']],
    [[0, 'bottom'], [2, 'top']],
    [[0, 'left'], [3, 'left']],
    [[0, 'top'], [5, 'left']],
    [[1, 'right'], [4, 'right']],
    [[1, 'bottom'], [2, 'right']],
    [[1, 'top'], [5, 'bottom']],
    [[2, 'bottom'], [4, 'top']],
    [[2, 'left'], [3, 'top']],
    [[3, 'right'], [4, 'left']],
    [[3, 'bottom'], [5, 'top']],
    [[4, 'bottom'], [5, 'right']],
  ]

  function findAdjacentSide(sideIndex, edge) {
    for (const [[a, aEdge], [b, bEdge]] of edges) {
      if (a === sideIndex && aEdge === edge) return [b, bEdge]
      if (b === sideIndex && bEdge === edge) return [a, aEdge]
    }
  }

  function transition(i, j, fromEdge, toEdge) {
    if (fromEdge === 'right') {
      if (toEdge === 'right') return [49 - i, 49]
      if (toEdge === 'bottom') return [49, i]
      if (toEdge === 'left') return [i, 0]
      if (toEdge === 'top') return [0, 49 - i]
    } else if (fromEdge === 'bottom') {
      if (toEdge === 'right') return [j, 49]
      if (toEdge === 'bottom') return [49, 49 - j]
      if (toEdge === 'left') return [49 - j, 0]
      if (toEdge === 'top') return [0, j]
    } else if (fromEdge === 'left') {
      if (toEdge === 'right') return [i, 49]
      if (toEdge === 'bottom') return [49, 49 - i]
      if (toEdge === 'left') return [49 - i, 0]
      if (toEdge === 'top') return [0, i]
    } else if (fromEdge === 'top') {
      if (toEdge === 'right') return [49 - j, 49]
      if (toEdge === 'bottom') return [49, j]
      if (toEdge === 'left') return [j, 0]
      if (toEdge === 'top') return [0, 49 - j]
    }
  }

  function dirForEdge(edge) {
    switch (edge) {
      case 'left': return 0
      case 'top': return 1
      case 'right': return 2
      case 'bottom': return 3
    }
  }

  function part2() {
    let sideIndex = 0
    let pos = [0, sides[0].indexOf('.')]
    let dirIndex = 0
    moves.forEach(move => {
      if (Number.isFinite(move)) {
        for (let i = 0; i < move; i += 1) {
          const dir = directions[dirIndex]
          let edge = null
          if (dirIndex === 0 && pos[1] === 49) edge = 'right'
          if (dirIndex === 1 && pos[0] === 49) edge = 'bottom'
          if (dirIndex === 2 && pos[1] === 0) edge = 'left'
          if (dirIndex === 3 && pos[0] === 0) edge = 'top'

          let nextSide = sideIndex
          let nextDir = dirIndex
          let nextPos, nextEdge
          if (edge) {
            [nextSide, nextEdge] = findAdjacentSide(sideIndex, edge)
            nextPos = transition(...pos, edge, nextEdge)
            nextDir = dirForEdge(nextEdge)
          } else {
            nextPos = [pos[0] + dir[0], pos[1] + dir[1]]
          }

          if (sides[nextSide][nextPos[0]][nextPos[1]] === '#') break

          sideIndex = nextSide
          pos = nextPos
          dirIndex = nextDir
        }
      } else {
        const dirChange = move === 'R' ? 1 : -1
        dirIndex = (dirIndex + dirChange + directions.length) % directions.length
      }
    })

    if (sideIndex === 0) {
      pos[0] += 50
    } else if (sideIndex === 1) {
      pos[0] += 100
    } else if (sideIndex === 2) {
      pos[0] += 50
      pos[1] += 50
    } else if (sideIndex === 3) {
      pos[0] += 100
    } else if (sideIndex === 4) {
      pos[0] += 100
      pos[1] += 50
    } else if (sideIndex === 5) {
      pos[0] += 150
    }
    return (pos[0] + 1) * 1000 + (pos[1] + 1) * 4 + dirIndex
  }

  console.log('Answer, part 2:', part2())
}
