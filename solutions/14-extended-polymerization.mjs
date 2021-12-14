import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(14)).split('\n'))
  const polymer = input.shift()
  const rules = input.map(line => line.split(' -> ').join('-'))

  const rulesMap = new Map(rules.map(rule => [
    rule,
    rules.filter(r => [rule[0] + rule[3], rule[3] + rule[1]].includes(r.substring(0, 2)))
  ]))

  function performSteps(n) {
    // Initialize letter counts
    const letters = new Set(rules.flatMap(k => k.split(/-?/)))
    const letterCounts = _.fromPairs(_.zip([...letters], new Array(letters.size).fill(0)))
    for (const letter of polymer) letterCounts[letter]++
    
    // Initialize rules which will be applied on the first step
    let stepRules = _.fromPairs(_.zip(rules, new Array(rules.length).fill(0)))
    _.zip([...polymer.slice(0, -1)], [...polymer.slice(1)]).map(pair => pair.join('')).forEach(pair => {
      let rule = rules.find(r => r.startsWith(pair))
      if (rule) stepRules[rule]++
    })

    // Apply N steps by counting the new letters introduced in the current step
    // and generating the rules for the next step
    _.times(n, _step => {
      const nextStepRules = _.fromPairs(_.zip(rules, new Array(rules.length).fill(0)))
      Object.keys(stepRules).forEach(rule => {
        letterCounts[rule[rule.length-1]] += stepRules[rule]
        rulesMap.get(rule).forEach(nextRule => nextStepRules[nextRule] += stepRules[rule])
      })
      stepRules = nextStepRules
    })

    const counts = Object.values(letterCounts).sort((a, b) => a - b)
    return counts[counts.length - 1] - counts[0]
  }
  
  console.log('Answer, part 1:', performSteps(10))
  console.log('Answer, part 2:', performSteps(40))
}
