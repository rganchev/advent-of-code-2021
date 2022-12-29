import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  async function obtainInputFile() {
    const items = _.compact((await fetchInputForDay(20, 2022)).split('\n')).map(value => ({
      value: Number(value),
      prev: null,
      next: null
    }))
    items.forEach((item, i) => {
      item.prev = items[(i - 1 + items.length) % items.length]
      item.next = items[(i + 1) % items.length]
    })
    return { items, head: items[0] }
  }

  function move(item, other, dir) {
    item.prev.next = item.next
    item.next.prev = item.prev
    item[dir > 0 ? 'prev' : 'next'] = other
    item[dir > 0 ? 'next' : 'prev'] = other[dir > 0 ? 'next' : 'prev']
    item.prev.next = item.next.prev = item
  }

  function indexOf(file, item) {
    let index = 0
    let cur = file.head
    while (cur !== item) {
      cur = cur.next
      index += 1
    }
    return index
  }

  function decrypt(file) {
    const n = file.items.length

    for (const item of file.items) {
      const dir = Math.sign(item.value)
      let remainingShift = Math.abs(item.value) % (n - 1)
      while (remainingShift > 0) {
        const index = indexOf(file, item)
        const maxShift = dir > 0 ? n - 1 - index : index
        const shift = Math.min(remainingShift, maxShift)

        if (shift > 0) {
          remainingShift -= shift
          let other = item
          _.times(shift, () => other = dir > 0 ? other.next : other.prev)
          move(item, other, dir)
          if (file.head === other) file.head = item
        }

        if (item.next === file.head && dir > 0) {
          file.head = item
        } else if (item === file.head && dir < 0) {
          file.head = item.next
        }
      }
    }

    return file
  }

  function findCoordinateSum(file) {
    let cur = file.items.find(i => i.value === 0)
    let sum = 0
    for (let i = 1; i <= 3000; i += 1) {
      cur = cur.next
      if (i % 1000 === 0) sum += cur.value
    }
    return sum
  }

  console.log('Answer, part 1:', findCoordinateSum(decrypt(await obtainInputFile())))

  let filePart2 = await obtainInputFile()
  filePart2.items.forEach(item => item.value *= 811589153)
  _.times(10, () => decrypt(filePart2))
  console.log('Answer, part 2:', findCoordinateSum(filePart2))
}
