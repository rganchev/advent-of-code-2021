import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = (await fetchInputForDay(5, 2022)).split('\n\n').map(section => _.compact(section.split('\n')))
  const stacks = _.compact(_.last(input[0]).split(/\s+/)).map(() => [])
  _.initial(input[0]).forEach(line => {
    stacks.forEach((stack, i) => {
      const crate = line[4 * i + 1]
      if (crate !== ' ') stack.push(crate)
    })
  })

  const moves = input[1].map(line => _.map(line.match(/\d+/g), Number))

  function moveCrates(reverse) {
    const reorder = crates => reverse ? crates.reverse() : crates
    let stacksCopy = _.cloneDeep(stacks)
    moves.forEach(([n, from, to]) =>
      stacksCopy[to - 1].unshift(...reorder(stacksCopy[from - 1].splice(0, n))))

    return stacksCopy
  }

  console.log('Answer, part 1:', moveCrates(true).map(s => s[0]).join(''))
  console.log('Answer, part 2:', moveCrates(false).map(s => s[0]).join(''))
}
