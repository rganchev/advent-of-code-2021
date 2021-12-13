import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(9)).split('\n')).map(l => l.split('').map(Number))
  const adj = (i, j) => [[i-1, j], [i+1, j], [i, j-1], [i, j+1]].filter(([k, l]) => input[k] && Number.isFinite(input[k][l]))
  const lowPoints = input
    .flatMap((row, i) => row.map((_, j) => [i, j]))
    .filter(([i, j]) => adj(i, j).every(([k, l]) => input[k][l] > input[i][j]))

  console.log('Answer, part 1:', _.sum(lowPoints.map(([i, j]) => input[i][j] + 1)))

  function traverseBasin(coords) {
    const q = [coords]
    let qIndex = 0

    while (qIndex < q.length) {
      const [curI, curJ] = q[qIndex]
      const curHeight = input[curI][curJ]
      qIndex += 1
      adj(curI, curJ)
        .filter(([adjI, adjJ]) => !q.find(([i, j]) => i === adjI && j === adjJ))
        .filter(([adjI, adjJ]) => curHeight < input[adjI][adjJ] && input[adjI][adjJ] < 9)
        .forEach(coords => q.push(coords))
    }

    return q.length
  }

  const basinsSizes = lowPoints.map(traverseBasin).sort((a, b) => b - a)
  console.log('Answer, part 2:', basinsSizes[0] * basinsSizes[1] * basinsSizes[2])
}
