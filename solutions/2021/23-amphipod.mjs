import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'
import { Heap } from './15-chiton.mjs'

export async function solve() {
  const input = (await fetchInputForDay(23)).trim().split('\n')
  const gameState = {
    hallway: new Array(11).fill(0),
    rooms: _.times(4, () => []),
    energy: 0,
  }
  input.slice(2, -1).map(line => line.split('').filter(c => /[A-D]/.test(c)))
    .forEach(line => line.forEach((amphipod, i) => gameState.rooms[i].push('ABCD'.indexOf(amphipod) + 1)))
  const roomEntrances = [2, 4, 6, 8]
  const targetRooms = [-1, 0, 1, 2, 3]
  const moveEnergies = [-1, 1, 10, 100, 1000]

  function replace(array, i, elem) {
    return [...array.slice(0, i), elem, ...array.slice(i + 1)]
  }

  function slice(array, a, b) {
    return array.slice(Math.min(a, b), Math.max(a, b) + 1)
  }

  function generateHallwayMoves({ hallway, rooms, energy }) {
    return _.compact(hallway.map((amphipod, i) => {
      if (amphipod === 0) return null

      const targetRoom = targetRooms[amphipod]
      const roomEntrance = roomEntrances[targetRoom]
      const roomSpot = rooms[targetRoom].lastIndexOf(0)
      const isHallwayFree = slice(hallway, i, roomEntrance).filter(x => x > 0).length === 1
      if (roomSpot < 0 || !isHallwayFree || rooms[targetRoom].some(x => x !== 0 && x !== amphipod)) return null

      const nMoves = roomSpot + 1 + Math.abs(i - roomEntrance)
      return {
        hallway: replace(hallway, i, 0),
        rooms: replace(rooms, targetRoom, replace(rooms[targetRoom], roomSpot, amphipod)),
        energy: energy + nMoves * moveEnergies[amphipod]
      }
    }))
  }

  function generateRoomMoves({ hallway, rooms, energy }) {
    return rooms.flatMap((room, i) => {
      if (room.every(x => x === 0 || x === targetRooms.indexOf(i))) { return [] }

      const amphipodIndex = room.findIndex(x => x > 0)
      const amphipod = room[amphipodIndex]
      const targetRoom = targetRooms[amphipod]
      if (
        rooms[targetRoom].every(x => x === 0 || x === amphipod) &&
        slice(hallway, roomEntrances[i], roomEntrances[targetRoom]).every(x => x === 0)
      ) {
        const roomSpot = rooms[targetRoom].lastIndexOf(0)
        const nMoves = amphipodIndex + roomSpot + 2 + Math.abs(roomEntrances[i] - roomEntrances[targetRoom])
        return [{
          hallway,
          rooms: replace(replace(rooms, i, replace(room, amphipodIndex, 0)), targetRoom, replace(rooms[targetRoom], roomSpot, amphipod)),
          energy: energy + nMoves * moveEnergies[amphipod]
        }]
      }

      const nextStates = []
      ;[-1, 1].forEach(direction => {
        for (let j = roomEntrances[i]; j >= 0 && j < hallway.length && hallway[j] === 0; j += direction) {
          if (!roomEntrances.includes(j)) {
            const nMoves = amphipodIndex + 1 + Math.abs(j - roomEntrances[i])
            nextStates.push({
              hallway: replace(hallway, j, amphipod),
              rooms: replace(rooms, i, replace(room, amphipodIndex, 0)),
              energy: energy + nMoves * moveEnergies[amphipod]
            })
          }
        }
      })

      return nextStates
    })
  }

  function isComplete({ rooms }) {
    return rooms.every((room, i) => room.every(x => x === targetRooms.indexOf(i)))
  }

  function encode({ hallway, rooms }) {
    return `${hallway.join('')}:${rooms.map(x => x.join('')).join(':')}`
  }

  function decode(str) {
    const [hallway, ...rooms] = str.split(':').map(x => x.split('').map(Number))
    return { hallway, rooms }
  }

  function findSolution(initialState) {
    const energies = new Heap([{ id: encode(initialState), weight: 0 }])
    const visited = new Set([encode(initialState)])
    let state
    do {
      const { id, weight: energy } = energies.takeMin()
      const { hallway, rooms } = decode(id)
      state = { hallway, rooms, energy }
      visited.add(encode(state))
      ;[...generateHallwayMoves(state), ...generateRoomMoves(state)]
        .forEach(s => {
          const id = encode(s)
          if (visited.has(id)) return

          if (energies.has(id)) {
            energies.update({ id, weight: Math.min(energies.getWeight(id), s.energy) })
          } else {
            energies.add({ id, weight: s.energy })
          }
        })
    } while (!isComplete(state))

    return state.energy
  }

  console.log('Answer, part 1:', findSolution(gameState))
  console.log('Answer, part 2:', findSolution({
    ...gameState,
    rooms: [
      [gameState.rooms[0][0], 4, 4, gameState.rooms[0][1]],
      [gameState.rooms[1][0], 3, 2, gameState.rooms[1][1]],
      [gameState.rooms[2][0], 2, 1, gameState.rooms[2][1]],
      [gameState.rooms[3][0], 1, 3, gameState.rooms[3][1]],
    ],
  }))
}
