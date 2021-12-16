import { fetchInputForDay } from '../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = (await fetchInputForDay(16)).trim().split('').map(x => Number.parseInt(x, 16))
  const bits = input.flatMap(x => x.toString(2).padStart(4, '0').split(''))

  function decodePacket(packet) {
    const initialLength = packet.length
    const version = Number.parseInt(_.times(3, () => packet.shift()).join(''), 2)
    const typeID = Number.parseInt(_.times(3, () => packet.shift()).join(''), 2)
    let number, subpackets

    if (typeID === 4) {
      // Packet is a number
      let indicator
      let numberBits = []
      do {
        indicator = packet.shift()
        numberBits = numberBits.concat(_.times(4, () => packet.shift()))
      } while (indicator === '1')
      number = Number.parseInt(numberBits.join(''), 2)
    } else {
      // Packet is an operator
      if (packet.shift() === '0') {
        const totalLength = Number.parseInt(_.times(15, () => packet.shift()).join(''), 2)
        subpackets = []
        let consumedLength = 0
        while (consumedLength < totalLength) {
          const subpacket = decodePacket(packet)
          subpackets.push(subpacket)
          consumedLength += subpacket.length
        }
      } else {
        const nSubpackets = Number.parseInt(_.times(11, () => packet.shift()).join(''), 2)
        subpackets = _.times(nSubpackets, () => decodePacket(packet))
      }
    }

    const length = initialLength - packet.length
    return { version, typeID, length, number, subpackets }
  }

  function sumVersions(packet) {
    if (packet.typeID === 4) return packet.version
    return packet.version + _.sum(packet.subpackets.map(sumVersions))
  }

  function calculateValue(packet) {
    if (packet.typeID === 4) return packet.number

    const subpacketValues = packet.subpackets.map(calculateValue)
    switch (packet.typeID) {
    case 0:
      return _.sum(subpacketValues)
    case 1:
      return subpacketValues.reduce((p, x) => p * x, 1)
    case 2:
      return _.min(subpacketValues)
    case 3:
      return _.max(subpacketValues)
    case 5:
      return subpacketValues[0] > subpacketValues[1] ? 1 : 0
    case 6:
      return subpacketValues[0] < subpacketValues[1] ? 1 : 0
    case 7:
      return subpacketValues[0] === subpacketValues[1] ? 1 : 0
    }
  }

  const packet = decodePacket(bits)
  console.log('Answer, part 1:', sumVersions(packet))
  console.log('Answer, part 2:', calculateValue(packet))
}
