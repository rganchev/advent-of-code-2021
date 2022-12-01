import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

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
    origin: [0, 0, 0],
  }]
  const unidentifiedScanners = new Set(rotatedScanners.slice(1))
  for (const { beacons: beaconsA } of identifiedScanners) {
    for (const scannerB of unidentifiedScanners) {
      for (const rotatedBeaconsB of scannerB) {
        const allPointDiffs = beaconsA.flatMap(a => rotatedBeaconsB.map(b => a.map((x, i) => x - b[i]).join(':')))
        const [translationStr, count] = _.chain(allPointDiffs).countBy(x => x).toPairs().maxBy(x => x[1]).value()
        if (count >= 12) {
          const translation = translationStr.split(':').map(Number)
          unidentifiedScanners.delete(scannerB)
          identifiedScanners.push({
            beacons: rotatedBeaconsB.map(b => translate(b, translation)),
            origin: translation,
          })
          break
        }
      }
    }
  }

  const allBeacons = new Set(identifiedScanners.flatMap(s => s.beacons.map(b => b.join(':'))))
  console.log('Answer, part 1:', allBeacons.size)

  const originPairs = identifiedScanners.slice(0, -1).flatMap((s, i) => identifiedScanners.slice(i + 1).map(t => [s.origin, t.origin]))
  const maxDistance = _.max(originPairs.map(([a, b]) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])))
  console.log('Answer, part 2:', maxDistance)
}
