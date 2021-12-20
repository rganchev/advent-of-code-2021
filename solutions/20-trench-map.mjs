import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(20)).split('\n'))
  const enhancementAlgorithm = [...input.shift()].map(c => '.#'.indexOf(c))
  const bitmap = input.map(row => [...row].map(c => '.#'.indexOf(c)))

  function padZeros(bitmap, n) {
    const zeroRow = new Array(bitmap[0].length + 2 * n).fill(0)
    const padding = new Array(n).fill(0)
    return [
      ..._.times(n, () => [...zeroRow]),
      ...bitmap.map(row => [...padding, ...row, ...padding]),
      ..._.times(n, () => [...zeroRow]),
    ]
  }
  
  function getClamped(bitmap, i, j) {
    return bitmap[Math.min(Math.max(0, i), bitmap.length - 1)][Math.min(Math.max(0, j), bitmap[0].length - 1)]
  }

  function mapPixel(bitmap, i, j) {
    const index = Number.parseInt([
      [i-1, j-1], [i-1, j], [i-1, j+1],
      [i,   j-1], [i,   j], [i,   j+1],
      [i+1, j-1], [i+1, j], [i+1, j+1]
    ].map(coords => getClamped(bitmap, ...coords)).join(''), 2)

    return enhancementAlgorithm[index]
  }

  let processedBitmap = padZeros(bitmap, 50, 0)
  _.times(50, step => {
    processedBitmap = processedBitmap.map((row, i) => row.map((_, j) => mapPixel(processedBitmap, i, j)))
    if (step === 1) {
      console.log('Answer, part 1:', _.sum(processedBitmap.map(_.sum)))
    }
  })

  console.log('Answer, part 2:', _.sum(processedBitmap.map(_.sum)))
}
