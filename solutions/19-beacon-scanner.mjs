import { fetchInputForDay } from '../input.mjs'

function rotation(axis, angle) {
  const index = ['x', 'y', 'z'].indexOf(axis)
  const matrix = [
    [Math.cos(angle), -Math.sin(angle)],
    [Math.sin(angle), Math.cos(angle)],
  ]
  matrix[0].splice(index, 0, 0)
  matrix[1].splice(index, 0, 0)
  const zeroRow = [0, 0]
  zeroRow.splice(index, 0, 1)
  matrix.splice(index, 0, zeroRow)
  return matrix
}

function generateRotations() {
  const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]
  const rotations = ['x', 'y', 'z'].map(axis => angles.map(angle => rotation(axis, angle)))
  const allRotations = []
  const matMul = (a, b) => a.map(aRow => b[0].map((_, j) => aRow.reduce((sum, aElem, i) => sum + aElem * b[i][j], 0)))
  const cmp = (a, b) => !a.find((row, i) => row.find((elem, j) => Math.abs(elem - b[i][j]) > 1e-6))
  rotations[0].forEach(xRotation => rotations[1].forEach(yRotation => rotations[2].forEach(zRotation => {
    const rotation = matMul(matMul(xRotation, yRotation), zRotation)
    if (!allRotations.find(r => cmp(r, rotation))) {
      allRotations.push(rotation)
    }
  })))

  return allRotations
}

function hash(beacon) {
  return (beacon[0] << 20) + (beacon[1] << 10) + beacon[2]
}

function rotate(x, r) {
  return [
    r[0][0] * x[0] + r[0][1] * x[1] + r[0][2] * x[2],
    r[1][0] * x[0] + r[1][1] * x[1] + r[1][2] * x[2],
    r[2][0] * x[0] + r[2][1] * x[1] + r[2][2] * x[2],
  ]
}

function translate(x, t) {
  return x.map((elem, i) => elem + t[i])
}

export async function solve() {
  const scanners = (await fetchInputForDay(19)).trim().split('\n\n')
    .map(s => s.split('\n').slice(1).map(b => b.split(',').map(Number)))
    .map(s => s.sort((a, b) => a[0] - b[0]))

  const rotations = generateRotations().map(r => r.map(row => row.map(x => Math.round(x))))
  const rotatedScanners = scanners.map(scanner =>
    rotations.map(rotation =>
      scanner.map(beacon => rotate(beacon, rotation)).sort((x, y) => x[0] - y[0])
    )
  )
  const identifiedScanners = [{
    beacons: rotatedScanners[0][0],
    referenceIndex: -1,
    translation: [0, 0, 0],
  }]
  let index = -1
  const unidentifiedScanners = new Set(rotatedScanners.slice(1))
  while (unidentifiedScanners.size > 0) {
    index += 1
    const scannerA = identifiedScanners[index].beacons
    const beaconSetA = new Set(scannerA.map(hash))
    ;[...unidentifiedScanners].forEach(scannerB => {
      for (const rotatedBeaconsB of scannerB) {
        const isIdentified = scannerA.slice(11).some(beaconA => rotatedBeaconsB.slice(11).some(beaconB => {
          const translation = beaconA.map((a, i) => a - beaconB[i])
          const transformedBeaconB = rotatedBeaconsB.map(beacon => translate(beacon, translation))
          const nOverlapping = transformedBeaconB.filter(x => beaconSetA.has(hash(x))).length
          if (nOverlapping >= 12) {
            unidentifiedScanners.delete(scannerB)
            identifiedScanners.push({
              beacons: rotatedBeaconsB,
              referenceIndex: index,
              translation,
            })
            return true
          }
        }))
        if (isIdentified) { break }
      }
    })
  }

  const allBeacons = new Set()
  for (const scanner of identifiedScanners) {
    let beacons = scanner.beacons
    let current = scanner
    while (current) {
      beacons = beacons.map(b => translate(b, current.translation))
      current = identifiedScanners[current.referenceIndex]
    }
    beacons.map(hash).forEach(b => allBeacons.add(b))
  }
  console.log('Answer, part 1:', allBeacons.size)

  const scannerPositions = identifiedScanners.map(scanner => {
    let origin = [0, 0, 0]
    let current = scanner
    while (current) {
      origin = translate(origin, current.translation)
      current = identifiedScanners[current.referenceIndex]
    }
    return origin
  })
  let maxDistance = -Infinity
  for (let i = 0; i < scannerPositions.length - 1; i++) {
    const a = scannerPositions[i]
    for (let j = i + 1; j < scannerPositions.length; j++) {
      const b = scannerPositions[j]
      const distance = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
      maxDistance = Math.max(distance, maxDistance)
    }
  }
  console.log('Answer, part 2:', maxDistance)
}
