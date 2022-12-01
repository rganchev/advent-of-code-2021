import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = (await fetchInputForDay(4)).split('\n\n')
  const numbers = input.shift().split(',').map(Number)
  const boards = input.map(board => _.compact(board.split(/\s+/m)).map(Number))
  const size = input[0].split('\n').length

  function markAndCheck(board, number) {
    const index = board.indexOf(number)
    if (index < 0) return false

    board[index] = NaN
    const rowStart = Math.floor(index / size) * size
    const row = board.filter((x, i) => rowStart <= i && i < rowStart + size)
    const col = board.filter((x, i) => i % size === index % size)
    return row.every(x => Number.isNaN(x)) || col.every(x => Number.isNaN(x))
  }

  let bingoBoard = null
  let number = numbers.find(num => !!(bingoBoard = boards.find(board => markAndCheck(board, num))))
  console.log('Answer, part 1:', number * _.sum(bingoBoard.filter(x => Number.isFinite(x))))

  number = numbers.find(num => {
    boards.forEach((board, boardIndex) => {
      if (board && markAndCheck(board, num)) {
        bingoBoard = board
        boards[boardIndex] = null
      }
    })
    return boards.filter(x => !!x).length === 0
  })
  console.log('Answer, part 2:', number * _.sum(bingoBoard.filter(x => Number.isFinite(x))))
}
