import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  let packets = _.compact((await fetchInputForDay(13, 2022)).split('\n\n'))
    .map(pair => pair.split('\n').map(packet => eval(packet)))

  function compare(left, right) {
    if (Number.isFinite(left) && Number.isFinite(right)) return Math.sign(left - right)
    if (Number.isFinite(left) && Array.isArray(right)) return compare([left], right)
    if (Array.isArray(left) && Number.isFinite(right)) return compare(left, [right])

    for (let i = 0; i < Math.min(left.length, right.length); i += 1) {
      const cmp = compare(left[i], right[i])
      if (cmp !== 0) return cmp
    }

    return Math.sign(left.length - right.length)
  }

  const part1 = packets.reduce((sum, pair, index) => sum + (compare(...pair) < 0 ? index + 1 : 0), 0)
  console.log('Answer, part 1', part1)

  const sortedPackets = [...packets, [[[2]], [[6]]]].flat().sort(compare)
  const index1 = sortedPackets.findIndex(x => x.length === 1 && x[0].length === 1 && x[0][0] === 2)
  const index2 = sortedPackets.findIndex(x => x.length === 1 && x[0].length === 1 && x[0][0] === 6)
  console.log('Answer, part 2', (index1 + 1) * (index2 + 1))
}
