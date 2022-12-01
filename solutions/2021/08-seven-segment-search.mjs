import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(8)).split('\n')).map(l => l.split(' | ').map(x => x.split(/\s+/)))
  console.log('Answer, part 1:', _.sum(input.map(i => i[1].filter(x => [2, 3, 4, 7].includes(x.length)).length)))

  const intersection = (setA, setB) => new Set([...setA].filter(x => setB.has(x)))
  const isSuperset = (setA, setB) => [...setB].every(x => setA.has(x))

  function decode(digit, four, seven) {
    switch (digit.size) {
    case 2: return 1
    case 3: return 7
    case 4: return 4
    case 5:
      if (isSuperset(digit, seven)) return 3
      if (intersection(digit, four).size === 3) return 5
      return 2
    case 6:
      if (isSuperset(digit, four)) return 9
      if (isSuperset(digit, seven)) return 0
      return 6
    case 7: return 8
    }
  }

  const outputs = input.map(([digits, output]) => {
    const four = digits.find(x => x.length === 4)
    const seven = digits.find(x => x.length === 3)
    const decoded = output.map(x => decode(...[x, four, seven].map(d => new Set(d.split('')))))
    return decoded.reverse().reduce((s, d, i) => s + d * Math.pow(10, i))
  })
  console.log('Answer, part 2:', outputs.reduce((a, b) => a + b))
}
