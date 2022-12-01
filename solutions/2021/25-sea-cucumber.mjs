import { fetchInputForDay } from '../../input.mjs'

export async function solve() {
  const map = (await fetchInputForDay(25)).trim().split('\n').map(line => line.trim().split(''))

  function step() {
    const firstCol = map.map(line => line[0])
    const lastCol = map.map(line => line[line.length - 1])
    let didMove = false
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length - 1; j++) {
        if (map[i][j] === '>' && map[i][j + 1] === '.') {
          map[i][j] = '.'
          map[i][j + 1] = '>'
          j += 1
          didMove = true
        }
      }
    }
    for (let i = 0; i < map.length; i++) {
      if (lastCol[i] === '>' && firstCol[i] === '.') {
        map[i][map[i].length - 1] = '.'
        map[i][0] = '>'
        didMove = true
      }
    }

    const firstRow = [...map[0]]
    const lastRow = [...map[map.length - 1]]
    for (let j = 0; j < map[0].length; j++) {
      for (let i = 0; i < map.length - 1; i++) {
        if (map[i][j] === 'v' && map[i + 1][j] === '.') {
          map[i][j] = '.'
          map[i + 1][j] = 'v'
          i += 1
          didMove = true
        }
      }
    }
    for (let j = 0; j < map[0].length; j++) {
      if (lastRow[j] === 'v' && firstRow[j] === '.') {
        map[map.length - 1][j] = '.'
        map[0][j] = 'v'
        didMove = true
      }
    }
    return didMove
  }

  let i = 0
  while (step()) i++

  console.log('Answer:', i + 1)
}
