import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = (await fetchInputForDay(24)).trim()
  const programs = _.compact(input.split('inp w\n')).map(subprogram => subprogram.trim().split('\n'))
  const stages = programs.map(program => ({
    shouldPop: Number(program[3].split(' ')[2]) === 26,
    xOffset: Number(program[4].split(' ')[2]),
    zOffset: Number(program[14].split(' ')[2]),
  }))
  const allDigits = _.times(9, i => i + 1)

  function generateModelNumber(digits, z) {
    if (digits.length === stages.length) return z.length === 0 ? Number(digits.join('')) : null

    const remainingPops = stages.slice(digits.length).filter(stage => stage.shouldPop).length
    if (remainingPops < z.length) return null

    const currentStage = stages[digits.length]
    const reference = z.length > 0 ? z[z.length - 1] : 0
    const nextDigits = allDigits.filter(digit => remainingPops > z.length || digit === reference + currentStage.xOffset)
    if (currentStage.shouldPop) z.pop()

    for (const digit of nextDigits) {
      digits.push(digit)
      const newZ = [...z]
      if (digit != reference + currentStage.xOffset) newZ.push(digit + currentStage.zOffset)
      const result = generateModelNumber(digits, newZ)
      if (result) return result
      digits.pop()
    }
  }

  allDigits.reverse()
  console.log('Answer, part 1:', generateModelNumber([], []))
  allDigits.reverse()
  console.log('Answer, part 2:', generateModelNumber([], []))
}
