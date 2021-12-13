import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

const bracketMap = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}

const errorScores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const completionScores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

export async function solve() {
  const input = _.compact((await fetchInputForDay(10)).split('\n'))
  
  function findError(line) {
    const q = []
    for (const c of line) {
      if (Object.keys(bracketMap).includes(c)) {
        q.push(c)
      } else if (bracketMap[q.pop()] !== c) {
        return errorScores[c]
      }
    }
    return q
  }

  const errors = input.map(findError).filter(x => Number.isInteger(x))
  console.log('Answer, part 1:', _.sum(errors))

  const incomplete = input
    .map(findError)
    .filter(x => Array.isArray(x))
    .map(q => q.reverse().reduce((s, x) => 5 * s + completionScores[bracketMap[x]], 0))
    .sort((a, b) => a - b)
  console.log('Answer, part 2:', incomplete[Math.floor(incomplete.length / 2)])
}
