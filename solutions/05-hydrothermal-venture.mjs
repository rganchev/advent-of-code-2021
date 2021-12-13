import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const lines = _.compact((await fetchInputForDay(5)).split('\n')).map(l => l.split(' -> ').map(p => p.split(',').map(Number)))
  const maxX = _.max(lines.flatMap(([a, b]) => [a[0], b[0]]))
  const maxY = _.max(lines.flatMap(([a, b]) => [a[1], b[1]]))
  const canvas = new Array((maxX + 1) * (maxY + 1)).fill(0)
  
  const p = (x, y) => y * (maxX + 1) + x

  function drawLine(a, b) {
    if (a[0] === b[0]) {
      for (let y = Math.min(a[1], b[1]); y <= Math.max(a[1], b[1]); y++) {
        canvas[p(a[0], y)] += 1
      }
    } else {
      const slope = (b[1] - a[1]) / (b[0] - a[0])
      const intercept = a[1] - slope * a[0]
      for (let x = Math.min(a[0], b[0]); x <= Math.max(a[0], b[0]); x++) {
        canvas[p(x, Math.round(slope * x + intercept))] += 1
      }
    }
  }

  lines.filter(([a, b]) => a[0] === b[0] || a[1] === b[1]).forEach(line => drawLine(...line))
  console.log('Answer, part 1:', canvas.filter(p => p > 1).length)

  lines.filter(([a, b]) => a[0] !== b[0] && a[1] !== b[1]).forEach(line => drawLine(...line))
  console.log('Answer, part 2:', canvas.filter(p => p > 1).length)
}
