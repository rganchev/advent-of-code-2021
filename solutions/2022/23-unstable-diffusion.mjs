import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const map = _.compact((await fetchInputForDay(23, 2022)).split('\n')).map(row => row.split(''))
  const elves = map.reduce((acc, row, i) => [...acc, ..._.compact(row.map((x, j) => x === '#' ? [i, j] : null))], [])
  const directions = { N: [-1, 0], NE: [-1, 1], E: [0, 1], SE: [1, 1], S: [1, 0], SW: [1, -1], W: [0, -1], NW: [-1, -1] }

  function encode([i, j]) { return (i << 16) + j }

  function findPositionsRange() {
    let min = [Infinity, Infinity]
    let max = [-Infinity, -Infinity]
    elves.forEach(([i, j]) => {
      min[0] = Math.min(i, min[0])
      min[1] = Math.min(j, min[1])
      max[0] = Math.max(i, max[0])
      max[1] = Math.max(j, max[1])
    })
    return [min, max]
  }

  const adjacentDirs = dir => Object.keys(directions).filter(k => k.includes(dir)).map(d => directions[d])
  const directionChecks = ['N', 'S', 'W', 'E'].map(dir => [directions[dir], adjacentDirs(dir)])
  const occupiedPositions = new Set(elves.map(encode))

  function move() {
    const [min, max] = findPositionsRange()
    const map = _.times(max[0] - min[0] + 1, () => new Array(max[1] - min[1] + 1).fill('.'))
    elves.forEach(([i, j]) => map[i - min[0]][j - min[1]] = '#')

    const suggestionSet = new Set()
    const conflicts = new Set()
    const suggestions = elves.map(([i, j]) => {
      if (Object.values(directions).every(([di, dj]) => !occupiedPositions.has(encode([i + di, j + dj])))) {
        return null
      }
      const suggestedDir = directionChecks.find(
        checks => checks[1].every(([di, dj]) => !occupiedPositions.has(encode([i + di, j + dj])))
      )?.[0]
      const suggestion = suggestedDir ? [i + suggestedDir[0], j + suggestedDir[1]] : null
      if (suggestion) {
        const encodedSuggestion = encode(suggestion)
        if (suggestionSet.has(encodedSuggestion)) {
          conflicts.add(encodedSuggestion)
        } else {
          suggestionSet.add(encodedSuggestion)
        }
      }
      return suggestion
    })

    const moved = suggestions.filter((newPos, index) => {
      if (newPos && !conflicts.has(encode(newPos))) {
        occupiedPositions.delete(encode(elves[index]))
        occupiedPositions.add(encode(newPos))
        elves[index] = newPos
        return true
      }
      return false
    })

    directionChecks.push(directionChecks.shift())

    return moved.length
  }

  _.times(10, move)
  const [min, max] = findPositionsRange()
  console.log('Answer, part 1:', (max[0] - min[0] + 1) * (max[1] - min[1] + 1) - elves.length)

  let count = 10
  while (move() > 0) count += 1

  console.log('Answer, part 2:', count + 1)
}
