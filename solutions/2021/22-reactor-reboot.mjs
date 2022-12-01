import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = (await fetchInputForDay(22)).trim().split('\n')
    .map(line => /^(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/.exec(line).slice(1))
    .map(([action, minX, maxX, minY, maxY, minZ, maxZ]) => ({
      isOn: action === 'on',
      cuboid: {
        x: { min: Number(minX), max: Number(maxX) },
        y: { min: Number(minY), max: Number(maxY) },
        z: { min: Number(minZ), max: Number(maxZ) },
      },
    }))

  function intervalIntersection(a, b) {
    const min = Math.max(a.min, b.min)
    const max = Math.min(a.max, b.max)
    return max < min ? null : { min, max }
  }

  function intersection(cuboids) {
    if (cuboids.length > 2) {
      const firstIntersection = intersection(cuboids.slice(0, 2))
      return firstIntersection && intersection([firstIntersection, ...cuboids.slice(2)])
    }
    const [x, y, z] = ['x', 'y', 'z'].map(axis => intervalIntersection(cuboids[0][axis], cuboids[1][axis]))
    return x && y && z && { x, y, z }
  }

  function difference(cuboidA, [cuboidB, ...otherCuboids]) {
    if (otherCuboids.length > 0) {
      let diff = difference(cuboidA, [cuboidB])
      for (const other of otherCuboids) {
        diff = diff.flatMap(c => difference(c, [other]))
      }
      return diff
    }

    const intersect = intersection([cuboidA, cuboidB])
    if (!intersect) { return [cuboidA] }

    const cuboids = []
    if (cuboidA.x.min < intersect.x.min) {
      cuboids.push({ x: { min: cuboidA.x.min, max: intersect.x.min - 1 }, y: cuboidA.y, z: cuboidA.z })
    }
    if (cuboidA.x.max > intersect.x.max) {
      cuboids.push({ x: { min: intersect.x.max + 1, max: cuboidA.x.max }, y: cuboidA.y, z: cuboidA.z })
    }
    if (cuboidA.y.min < intersect.y.min) {
      cuboids.push({ x: intersect.x, y: { min: cuboidA.y.min, max: intersect.y.min - 1 }, z: cuboidA.z })
    }
    if (cuboidA.y.max > intersect.y.max) {
      cuboids.push({ x: intersect.x, y: { min: intersect.y.max + 1, max: cuboidA.y.max }, z: cuboidA.z })
    }
    if (cuboidA.z.min < intersect.z.min) {
      cuboids.push({ x: intersect.x, y: intersect.y, z: { min: cuboidA.z.min, max: intersect.z.min - 1 } })
    }
    if (cuboidA.z.max > intersect.z.max) {
      cuboids.push({ x: intersect.x, y: intersect.y, z: { min: intersect.z.max + 1, max: cuboidA.z.max } })
    }
    return cuboids
  }

  function volume({ x, y, z}) {
    return (x.max - x.min + 1) * (y.max - y.min + 1) * (z.max - z.min + 1)
  }

  function executeCommands(commands) {
    while (true) {
      let index = commands.findIndex(x => !x.isOn)
      if (index < 0) break

      while (index > 0) {
        const diff = difference(commands[index - 1].cuboid, [commands[index].cuboid]).map(cuboid => ({ isOn: true, cuboid }))
        commands.splice(index - 1, 2, commands[index], ...diff)
        index -= 1
      }
      commands.shift()
    }

    const cuboids = commands.map(x => x.cuboid)
    for (let i = 1; i < cuboids.length; i++) {
      const diff = difference(cuboids[i], cuboids.slice(0, i))
      cuboids.splice(i, 1, ...diff)
      i += diff.length - 1
    }

    return _.sum(cuboids.map(volume))
  }

  const initArea = { x: { min: -50, max: 50 }, y: { min: -50, max: 50 }, z: { min: -50, max: 50 } }
  const initInput = input.filter(({ cuboid }) => !!intersection([cuboid, initArea]))

  console.log('Answer, part 1:', executeCommands(initInput))
  console.log('Answer, part 2:', executeCommands(input))
}
