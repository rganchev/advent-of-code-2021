import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const instructions = _.compact((await fetchInputForDay(10, 2022)).split('\n')).map(i => i.split(' '))

  function runProgram(onCycle) {
    let cycle = 1
    let x = 1
    instructions.forEach(([instruction, arg]) => {
      onCycle(cycle, x)
      cycle += 1
      if (instruction === 'addx') {
        onCycle(cycle, x)
        cycle += 1
        x += Number(arg)
      }
    })
  }

  let signalStrength = 0
  runProgram((cycle, x) => {
    if ((cycle + 20) % 40 === 0) {
      signalStrength += cycle * x
    }
  })
  console.log('Answer, part 1:', signalStrength)

  const screen = _.times(6, () => new Array(40).fill(false))
  runProgram((cycle, x) => {
    const index = cycle - 1
    if (Math.abs(x - index % 40) <= 1) {
      screen[Math.floor(index / 40)][index % 40] = true
    }
  })
  console.log('Answer, part 2:\n', screen.map(line => line.map(pixel => pixel ? '#' : ' ').join('')))
}
