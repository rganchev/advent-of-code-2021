import { fetchInputForDay } from '../../input.mjs'

class SnailfishNumber {
  constructor() {
    this.parent = null
  }

  depth() { return this.parent ? this.parent.depth() + 1 : 0 }
  add(other) { return new Pair(this.clone(), other.clone()).reduce() }

  replace(other) {
    other.parent = this.parent
    if (this.parent.left === this) { this.parent.left = other }
    else { this.parent.right = other }
  }
}

class Pair extends SnailfishNumber {
  constructor(left, right) {
    super()
    this.left = left
    this.right = right
    left.parent = this
    right.parent = this
  }

  magnitude() { return 3 * this.left.magnitude() + 2 * this.right.magnitude() }
  toString() { return `[${this.left.toString()}, ${this.right.toString()}]` }
  clone() { return new Pair(this.left.clone(), this.right.clone()) }
  findLargeNum() { return this.left.findLargeNum() || this.right.findLargeNum() }

  reduce() {
    while (true) {
      let deepPair, largeNum
      if (deepPair = this.findDeepPair()) { deepPair.explode() }
      else if (largeNum = this.findLargeNum()) { largeNum.split() }
      else { break }
    }
    return this
  }

  findDeepPair() {
    if (this.depth() >= 4 && this.left instanceof Num && this.right instanceof Num) { return this }
    return (this.left instanceof Pair && this.left.findDeepPair()) ||
           (this.right instanceof Pair && this.right.findDeepPair()) ||
           null
  }

  findNum(dir) {
    let current = this
    while (current.parent?.[dir] === current) { current = current.parent }
    if (!current.parent) { return null }
    current = current.parent[dir]
    while (current instanceof Pair) { current = current[dir === 'left' ? 'right' : 'left'] }
    return current
  }

  explode() {
    let leftNum, rightNum
    if (leftNum = this.findNum('left')) { leftNum.value += this.left.value }
    if (rightNum = this.findNum('right')) { rightNum.value += this.right.value }
    this.replace(new Num(0))
  }
}

class Num extends SnailfishNumber {
  constructor(value) {
    super()
    this.value = value
  }

  magnitude() { return this.value }
  toString() { return `${this.value}` }
  clone() { return new Num(this.value) }
  findLargeNum() { return this.value > 9 ? this : null }

  split() {
    this.replace(new Pair(new Num(Math.floor(this.value / 2)), new Num(Math.ceil(this.value / 2))))
  }
}

export async function solve() {
  const parse = x => typeof x === 'number' ? new Num(x) : new Pair(...x.map(parse))
  const input = (await fetchInputForDay(18)).trim().split('\n').map(x => parse(JSON.parse(x)))

  const sum = input.slice(1).reduce((s, x) => s.add(x), input[0])
  console.log('Answer, part 1:', sum.magnitude())

  let largestMagnitude = -Infinity
  for (const number of input) {
    for (const other of input) {
      if (number === other) { continue }
      const magnitude = number.add(other).magnitude()
      largestMagnitude = Math.max(largestMagnitude, magnitude)
    }
  }
  console.log('Answer, part 2:', largestMagnitude)
}
