import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

class Point {
  constructor(str) {
    const [x, y] = str.split(',').map(Number)
    this.x = x
    this.y = y
  }

  toString() {
    return [this.x, this.y].join(',')
  }
}

export async function solve() {
  const [instructionsInput, pointsInput] = _.partition(_.compact((await fetchInputForDay(13)).split('\n')), l => l.startsWith('fold'))
  const instructions = instructionsInput.map(instruction => {
    const match = /(x|y)=(\d+)/.exec(instruction)
    return { x: Infinity, y: Infinity, [match[1]]: Number(match[2]) }
  })
  const points = new Set(pointsInput)

  instructions.forEach((instruction, i) => {
    ;[...points]
      .map(p => new Point(p))
      .filter(({ x, y }) => x > instruction.x || y > instruction.y)
      .forEach(point => {
        points.delete(String(point))
        const coord = ['x', 'y'].find(c => Number.isFinite(instruction[c]))
        point[coord] = 2 * instruction[coord] - point[coord]
        points.add(String(point))
      })
    
    if (i === 0) console.log('Answer, part 1:', points.size)
  })

  const width = Math.max(...[...points].map(p => new Point(p).x)) + 1
  const height = Math.max(...[...points].map(p => new Point(p).y)) + 1
  const canvas = _.times(height, _ => new Array(width).fill('.'))
  ;[...points].map(p => new Point(p)).forEach(({ x, y }) => canvas[y][x] = '#')

  console.log(`Answer, part 2:\n${canvas.map(line => line.join('')).join('\n')}`)
}
