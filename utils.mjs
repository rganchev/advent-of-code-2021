export function findCoords(matrix, value) {
  if (Array.isArray(matrix[0])) {
    let i = 0;
    let nestedCoords = null;
    while (i < matrix.length && !nestedCoords) {
      nestedCoords = findCoords(matrix[i], value);
      i += 1;
    }
    return Array.isArray(nestedCoords) ? [i - 1, ...nestedCoords] : null;
  }
  const index = matrix.indexOf(value);
  return index >= 0 ? [index] : null;
}

export function encode([i, j], [di, dj] = [0, 0]) {
  return (i << 14) | (j << 4) | ((di + 1) << 2) | (dj + 1);
}

export function decode(val) {
  const dirMask = 0b11;
  const coordMask = 0b1111111111;
  return [
    [(val >> 14) & coordMask, (val >> 4) & coordMask],
    [((val >> 2) & dirMask) - 1, (val & dirMask) - 1],
  ];
}

export function add(...vectors) {
  return vectors.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [0, 0]);
}

export function rotateLeft(vector) {
  return [-vector[1], vector[0]];
}

export function rotateRight(vector) {
  return [vector[1], -vector[0]];
}

export function getElem(matrix, indices) {
  return indices.reduce((value, i) => (typeof value === "object" ? value[i] : value), matrix);
}

export function setElem(matrix, indices, value) {
  const row = getElem(matrix, indices.slice(0, -1));
  if (row) {
    row[indices[indices.length - 1]] = value;
  }
}
