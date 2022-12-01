import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(11)).split('\n')).map(l => l.split('').map(Number))
  const adj = (i, j) => [[i-1, j-1], [i-1, j], [i-1, j+1], [i, j-1], [i, j+1], [i+1, j-1], [i+1, j], [i+1, j+1]].filter(([k, l]) => input[k] && Number.isFinite(input[k][l]))

  let sumFlashes = 0
  for (let step = 0; ; step++) {
    input.forEach(row => { for (const j in row) row[j] += 1 })
    let didFlash
    let nFlashes = 0
    do {
      didFlash = false
      input.forEach((row, i) => {
        for (let j = 0; j < row.length; j++) {
          if (Number.isFinite(row[j]) && row[j] > 9) {
            row[j] = Infinity
            adj(i, j).forEach(([k, l]) => input[k][l] += 1)
            didFlash = true
            nFlashes += 1
          }
        }
      })
    } while (didFlash)

    input.forEach(row => {
      for (const j in row) {
        if (!Number.isFinite(row[j])) {
          row[j] = 0
        }
      }
    })

    sumFlashes += nFlashes
    if (step === 99) {
      console.log('Answer, part 1:', sumFlashes)
    }
    if (nFlashes === 100) {
      console.log('Answer, part 2:', step + 1)
      break
    }
  }
}
