
import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const numbers = _.compact((await fetchInputForDay(25, 2022)).split('\n'))
  const digits = { '=': -2, '-': -1, '0': 0, '1': 1, '2': 2 }

  function snafuToDecimal(num) {
    return _.sum(num.split('').reverse().map((d, i) => Math.pow(5, i) * digits[d]))
  }

  function decimalToBaseFive(num) {
    let nDigits = 1
    while (Math.pow(5, nDigits) <= num) nDigits += 1

    let digits = new Array(nDigits)
    let remainder = num
    for (let i = 0; i < nDigits; i += 1) {
      const power = Math.pow(5, nDigits - i - 1)
      digits[i] = Math.floor(remainder / power)
      remainder -= digits[i] * power
    }

    return digits
  }

  function decimalToSnafu(num) {
    let powerSum = 2
    let degree = 0
    while (powerSum < num) {
      degree += 1
      powerSum += 2 * Math.pow(5, degree)
    }

    const baseFive = decimalToBaseFive(num + powerSum)
    return baseFive.map(digit => digit === 0 ? '=' : digit === 1 ? '-' : String(digit - 2)).join('')
  }

  console.log('Answer, part 1:', decimalToSnafu(_.sum(numbers.map(snafuToDecimal))))
}
