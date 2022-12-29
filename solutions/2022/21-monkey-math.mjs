import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const monkeys = _.compact((await fetchInputForDay(21, 2022)).split('\n'))
    .map(line => line.split(': '))
    .map(([name, value]) => ({ name, value }))

  monkeys.forEach(monkey => {
    if (Number.isNaN(Number(monkey.value))) {
      const [a, op, b] = monkey.value.split(' ')
      delete monkey.value
      monkey.expression = {
        op,
        left: monkeys.find(m => m.name === a),
        right: monkeys.find(m => m.name === b),
      }
    } else {
      monkey.value = Number(monkey.value)
    }
  })

  function calcPart1(monkey) {
    if (Number.isFinite(monkey.value)) return monkey.value

    const { left, right, op } = monkey.expression
    return eval(`${calcPart1(left)} ${op} ${calcPart1(right)}`)
  }

  function calcPart2(monkey) {
    // monkey = a * X + b
    if (monkey.name === 'humn') return { a: 1, b: 0 }
    if (Number.isFinite(monkey.value)) return { a: 0, b: monkey.value }

    const left = calcPart2(monkey.expression.left)
    const right = calcPart2(monkey.expression.right)
    const op = monkey.expression.op
    const b = eval(`${left.b} ${op} ${right.b}`)

    if (left.a === 0 && right.a === 0) return { a: 0, b }

    if (right.a !== 0 && (op === '/' || (op === '*' && left.a !== 0))) {
      throw new Error('Higher degree!')
    }

    if (op === '+' || op === '-') return { a: eval(`${left.a} ${op} ${right.a}`), b }

    return { a: eval(`${left.a || right.a} ${op} ${left.a ? right.b : left.b}`), b }
  }

  const root = monkeys.find(m => m.name === 'root')
  console.log('Answer, part 1:', calcPart1(root))

  const left = calcPart2(root.expression.left)
  const right = calcPart2(root.expression.right)
  console.log('Answer, part 2:', (right.b - left.b) / (left.a - right.a))
}
