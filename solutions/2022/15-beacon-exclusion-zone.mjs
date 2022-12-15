import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const sensors = _.compact((await fetchInputForDay(15, 2022)).split('\n'))
    .map(line => line.match(/-?\d+/g).map(Number))
    .map(coords => ({ location: coords.slice(0, 2), closestBeacon: coords.slice(2) }))

  sensors.forEach(sensor => {
    sensor.exclusionRadius = Math.abs(sensor.closestBeacon[0] - sensor.location[0]) +
      Math.abs(sensor.closestBeacon[1] - sensor.location[1])
  })

  function findExclusionIntervals(y) {
    const exclusionIntervals = []
    sensors.forEach(({ location, exclusionRadius }) => {
      const dy = Math.abs(y - location[1])
      const maxDx = exclusionRadius - dy
      if (maxDx >= 0) {
        exclusionIntervals.push([location[0] - maxDx, location[0] + maxDx])
      }
    })

    for (let i = 0; i < exclusionIntervals.length - 1; i += 1) {
      const interval = exclusionIntervals[i]
      let j = i + 1
      while (j < exclusionIntervals.length) {
        const otherInterval = exclusionIntervals[j]
        if (otherInterval[0] <= interval[1] && interval[0] <= otherInterval[1]) {
          interval[0] = Math.min(interval[0], otherInterval[0])
          interval[1] = Math.max(interval[1], otherInterval[1])
          exclusionIntervals.splice(j, 1)
          j = i + 1
        } else {
          j += 1
        }
      }
    }

    return exclusionIntervals.sort((a, b) => a[0] - b[0])
  }

  const part1Y = 2000000
  const part1Coverage = _.sum(findExclusionIntervals(part1Y).map(([a, b]) => b - a + 1))
  const part1Beacons = new Set(sensors.filter(s => s.closestBeacon[1] === part1Y).map(s => s.closestBeacon[0])).size
  console.log('Answer, part 1', part1Coverage - part1Beacons)

  let beaconLocation = null
  for (let y = 0; y <= 4000000 && !beaconLocation; y += 1) {
    const exclusionIntervals = findExclusionIntervals(y)
    for (let i = 1; i < exclusionIntervals.length && !beaconLocation; i += 1) {
      if (exclusionIntervals[i - 1][1] < exclusionIntervals[i][0] - 1) {
        beaconLocation = [exclusionIntervals[i][0] - 1, y]
      }
    }
  }
  console.log('Answer, part 2', beaconLocation[0] * 4000000 + beaconLocation[1])
}
