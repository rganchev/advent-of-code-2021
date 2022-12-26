import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const resourceTypes = ['geode', 'obsidian', 'clay', 'ore']
  const blueprints = _.compact((await fetchInputForDay(19, 2022)).split('\n'))
    .map(line => [...line.matchAll(/robot costs ([\w\d ]+)\./g)].map(
      ([, goods]) => _(goods.split(' and ').map(g => g.split(' ').reverse()))
        .fromPairs()
        .mapValues(Number)
        .value()
    ))
    .map(blueprint => blueprint.map(robot => resourceTypes.map(type => robot[type] || 0)).reverse())

  function timeToBuild(robot, availableResources, availableRobots) {
    const requiredResources = robot.map((res, i) => Math.max(0, res - availableResources[i]))
    return _.max(requiredResources.map((res, i) => Math.ceil(res / availableRobots[i] || 0))) + 1
  }

  function calcMaxGeodes(blueprint, availableTime) {
    let maxGeodes = 0
    const highestDemands = blueprint.reduce((prev, cur) => prev.map((max, i) => Math.max(max, cur[i])), [0, 0, 0, 0])

    function search(resources, robots, timeRemaining) {
      maxGeodes = Math.max(maxGeodes, resources[0] + robots[0] * timeRemaining)

      const maxPossibleResources = resources.map((available, i) => available + (2 * robots[i] + timeRemaining - 1) * timeRemaining / 2)
      if (
        maxPossibleResources[0] <= maxGeodes ||
        (robots[0] === 0 && maxPossibleResources[1] <= blueprint[0][1]) ||
        (robots[1] === 0 && maxPossibleResources[2] <= blueprint[1][2])
      ) return

      const timesToBuild = blueprint.map(robot => timeToBuild(robot, resources, robots))
      for (let i = 0; i < timesToBuild.length; i += 1) {
        const time = timesToBuild[i]
        if (time >= timeRemaining) continue
        if (i > 0 && resources[i] + robots[i] * timeRemaining >= highestDemands[i] * timeRemaining) continue

        const newResouces = resources.map((res, j) => res + time * robots[j] - blueprint[i][j])
        const newRobots = robots.map((r, j) => r + (i === j))
        search(newResouces, newRobots, timeRemaining - time)
      }
    }

    search([0, 0, 0, 0], [0, 0, 0, 1], availableTime)
    return maxGeodes
  }

  console.log('Answer, part 1:', _.sum(blueprints.map((b, i) => calcMaxGeodes(b, 24) * (i + 1))))
  console.log('Answer, part 2:', calcMaxGeodes(blueprints[0], 32) * calcMaxGeodes(blueprints[1], 32) * calcMaxGeodes(blueprints[2], 32))
}
