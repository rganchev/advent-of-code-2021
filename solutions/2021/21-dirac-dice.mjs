import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = (await fetchInputForDay(21)).trim().split('\n').map(line => Number(line.match(/\d+$/)[0]) - 1)

  function playDeterministicGame() {
    const positions = [...input]
    const scores = [0, 0]

    let numberOfRolls = 0
    let turn = 0

    function rollDeterministicDice(n) {
      const result = _.sum(_.times(n, i => 1 + (numberOfRolls + i) % 100))
      numberOfRolls += n
      return result
    }

    while (scores.every(score => score < 1000)) {
      positions[turn] = (positions[turn] + rollDeterministicDice(3)) % 10
      scores[turn] += positions[turn] + 1
      turn = (turn + 1) % 2
    }

    return scores.find(s => s < 1000) * numberOfRolls
  }

  function playDiracGame() {
    const [rolls, frequencies] = (() => {
      const rolls = _.times(3, i => i + 1)
      const allOutcomes = rolls.flatMap(a => rolls.flatMap(b => rolls.map(c => a + b + c)))
      const frequencies = _.countBy(allOutcomes, x => x)
      return [Object.keys(frequencies).map(Number), frequencies]
    })()

    const winningSequences = _.times(2, () => new Array(14).fill(0))
    const loosingSequences = _.times(2, () => new Array(14).fill(0))
    const score = (start, sequence) => sequence.length + sequence.reduce(([score, position], x) => {
      const newPosition = (position + x) % 10
      return [score + newPosition, newPosition]
    }, [0, start])[0]
    const countUniverses = sequence => sequence.map(roll => frequencies[roll]).reduce((a, b) => a * b, 1)

    ;(function generateSequences(sequence) {
      let isLoosingForAnyPlayer = sequence.length === 0
      if (sequence.length > 0) {
        const nUniverses = countUniverses(sequence)
        input.forEach((start, i) => {
          const isWinning = score(start, sequence) >= 21
          if (score(start, sequence.slice(0, -1)) < 21) {
            (isWinning ? winningSequences : loosingSequences)[i][sequence.length - 1] += nUniverses
          }
          isLoosingForAnyPlayer = isLoosingForAnyPlayer || !isWinning
        })
      }

      if (isLoosingForAnyPlayer) { rolls.forEach(roll => generateSequences([...sequence, roll])) }
    }([]))

    const playerOneWins = winningSequences[0].reduce((total, nUniverses, len) => len > 0 ? total + nUniverses * loosingSequences[1][len - 1] : total, 0)
    const playerTwoWins = winningSequences[1].reduce((total, nUniverses, len) => len > 0 ? total + nUniverses * loosingSequences[0][len] : total, 0)

    return Math.max(playerOneWins, playerTwoWins)
  }

  console.log('Answer, part 1:', playDeterministicGame())
  console.log('Answer, part 2:', playDiracGame())
}
