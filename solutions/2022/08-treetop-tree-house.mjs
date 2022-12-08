import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const map = _.compact((await fetchInputForDay(8, 2022)).split('\n')).map(row => row.split(''))

  let totalVisible = 0
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      let [top, right, bottom, left] = [1, 1, 1, 1]
      while (i - top >= 0 && map[i - top][j] < map[i][j]) top++
      while (j + right < map[0].length && map[i][j + right] < map[i][j]) right++
      while (i + bottom < map.length && map[i + bottom][j] < map[i][j]) bottom++
      while (j - left >= 0 && map[i][j - left] < map[i][j]) left++
      if (i - top < 0 || i + bottom >= map.length || j - left < 0 || j + right >= map[0].length) {
        totalVisible += 1
      }
    }
  }
  console.log('Answer, part 1:', totalVisible)

  let maxScore = 0
  for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[0].length - 1; j++) {
      let [top, right, bottom, left] = [1, 1, 1, 1]
      while (i - top > 0 && map[i - top][j] < map[i][j]) top++
      while (j + right < map[0].length - 1 && map[i][j + right] < map[i][j]) right++
      while (i + bottom < map.length - 1 && map[i + bottom][j] < map[i][j]) bottom++
      while (j - left > 0 && map[i][j - left] < map[i][j]) left++
      const score = top * right * bottom * left
      maxScore = score > maxScore ? score : maxScore
    }
  }
  console.log('Answer, part 2:', maxScore)
}
