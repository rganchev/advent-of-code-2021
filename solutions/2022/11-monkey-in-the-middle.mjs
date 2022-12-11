import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

class FactoredNumber {
  constructor(initialValue, mods = null) {
    this.mods = mods
    this.residuals = mods && mods.map(mod => initialValue % mod)
    this.value = mods ? null : initialValue
  }

  transform(op) {
    if (this.mods) {
      this.residuals = this.residuals.map((res, i) => op(res) % this.mods[i])
    } else {
      this.value = op(this.value)
    }
  }

  isDivisible(mod) {
    if (this.mods) {
      const modIndex = this.mods.indexOf(mod)
      if (modIndex < 0) throw new Error('Unkown factor', mod)

      return this.residuals[modIndex] === 0
    } else {
      return this.value % mod === 0
    }
  }
}

export async function solve() {
  const monkeys = _.compact((await fetchInputForDay(11, 2022)).split('\n\n'))
    .map(section => section.split('\n'))
    .map(section => ({
      items: section[1].match(/\d+/g).map(Number),
      op: old => eval(section[2].slice(section[2].indexOf('=') + 1)),
      testDivisible: Number(section[3].match(/\d+/)[0]),
      ifTrue: Number(section[4].match(/\d+/)[0]),
      ifFalse: Number(section[5].match(/\d+/)[0]),
      counter: 0
    }))

  function playRounds(nRounds, transform, useMods) {
    const monkeysCopy = _.cloneDeep(monkeys)
    const mods = monkeysCopy.map(m => m.testDivisible)
    monkeysCopy.forEach(m => {
      m.items = m.items.map(num => new FactoredNumber(num, useMods ? mods : null))
    })

    _.times(nRounds, () => {
      monkeysCopy.forEach(m => {
        m.items.forEach(worryLevel => {
          worryLevel.transform(num => transform(m, num))
          const nextMonkeyIndex = worryLevel.isDivisible(m.testDivisible) ? m.ifTrue : m.ifFalse
          monkeysCopy[nextMonkeyIndex].items.push(worryLevel)
          m.counter += 1
        })
        m.items = []
      })
    })

    return monkeysCopy.map(m => m.counter).sort((a, b) => b - a)
  }

  const countersPart1 = playRounds(20, (monkey, worryLevel) => Math.floor(monkey.op(worryLevel) / 3), false)
  console.log('Answer, part 1:', countersPart1[0] * countersPart1[1])

  const countersPart2 = playRounds(10000, (monkey, worryLevel) => monkey.op(worryLevel), true)
  console.log('Answer, part 2:', countersPart2[0] * countersPart2[1])
}
