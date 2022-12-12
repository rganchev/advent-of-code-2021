import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  let map = _.compact((await fetchInputForDay(12, 2022)).split('\n')).map(line => line.split(''))
  const iStart = map.findIndex(line => line.includes('S'))
  const start = { i: iStart, j: map[iStart].indexOf('S') }
  const iEnd = map.findIndex(line => line.includes('E'))
  const end = { i: iEnd, j: map[iEnd].indexOf('E') }

  map[start.i][start.j] = 'a'
  map[end.i][end.j] = 'z'
  map = map.map(line => line.map(c => c.charCodeAt(0) - 'a'.charCodeAt(0)))

  const visited = map.map(line => line.map(() => false))
  const distances = map.map(line => line.map(() => Infinity))
  visited[end.i][end.j] = true
  distances[end.i][end.j] = 0
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
  let cur = end

  while (cur.i >= 0 && cur.j >= 0) {
    directions.forEach(([di, dj]) => {
      const next = { i: cur.i + di, j: cur.j + dj }
      if (0 <= next.i && next.i < map.length && 0 <= next.j && next.j < map[0].length && map[cur.i][cur.j] - map[next.i][next.j] <= 1) {
        distances[next.i][next.j] = Math.min(distances[next.i][next.j], distances[cur.i][cur.j] + 1)
      }
    })
    visited[cur.i][cur.j] = true
    cur = { i: -1, j: -1 }
    let minUnvisitedDist = Infinity
    map.forEach((line, i) => line.forEach((_, j) => {
      if (!visited[i][j] && distances[i][j] < minUnvisitedDist) {
        cur = { i, j }
        minUnvisitedDist = distances[i][j]
      }
    }))
  }

  console.log('Answer, part 1', distances[start.i][start.j])

  let min = start
  map.forEach((line, i) => line.forEach((_, j) => {
    if (map[i][j] === 0 && distances[i][j] < distances[min.i][min.j]) {
      min = { i, j }
    }
  }))
  console.log('Answer, part 2', distances[min.i][min.j])
}
