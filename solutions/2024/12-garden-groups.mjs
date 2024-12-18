import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(12, 2024)).split("\n"));
  const height = input.length;
  const width = input[0].length;

  function dirIndex([x, y]) {
    return (((x + y + 1) / 2) << 1) | (x === 0 ? 1 : 0);
  }

  function add(...vectors) {
    return vectors.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [0, 0]);
  }

  function getLetter(coords) {
    return input[coords[0]]?.[coords[1]];
  }

  function rotateLeft(vector) {
    return [-vector[1], vector[0]];
  }

  function rotateRight(vector) {
    return [vector[1], -vector[0]];
  }

  function countSides(start, visitedFences) {
    const letter = input[start[0]][start[1]];
    let walkDir = [0, 1];

    if (visitedFences[start[0]][start[1]][dirIndex(rotateLeft(walkDir))]) {
      return 0;
    }

    let pos = start;
    let dirChanges = 0;
    do {
      const fenceDir = rotateLeft(walkDir);
      visitedFences[pos[0]][pos[1]][dirIndex(fenceDir)] = true;
      const forward = add(pos, walkDir);
      if (getLetter(forward) === letter) {
        const forwardLeft = add(forward, fenceDir);
        if (getLetter(forwardLeft) === letter) {
          pos = forwardLeft;
          walkDir = fenceDir;
          dirChanges += 1;
        } else {
          pos = forward;
        }
      } else {
        walkDir = rotateRight(walkDir);
        dirChanges += 1;
      }
    } while (!_.isEqual(walkDir, [0, 1]) || !_.isEqual(pos, start));

    return dirChanges;
  }

  function floodFill(start, hasDiscount, visited, visitedFences) {
    const letter = input[start[0]][start[1]];

    const stack = [start];
    visited[start[0]][start[1]] = true;

    let area = 0;
    let perimeter = 0;
    while (stack.length > 0) {
      const next = stack.pop();
      if (hasDiscount && getLetter(add(next, [-1, 0])) !== letter) {
        perimeter += countSides(next, visitedFences);
      }
      area += 1;
      let dir = [-1, 0];
      _.times(4, () => {
        const adj = add(next, dir);
        if (getLetter(adj) === letter) {
          if (!visited[adj[0]][adj[1]]) {
            stack.push(adj);
            visited[adj[0]][adj[1]] = true;
          }
        } else if (!hasDiscount) {
          perimeter += 1;
        }
        dir = rotateLeft(dir);
      });
    }
    return area * perimeter;
  }

  function calculatePrice(hasDiscount) {
    const visited = _.times(height, () => new Array(width).fill(false));
    const visitedFences = _.times(height, () => _.times(width, () => new Array(4).fill(false)));

    let sum = 0;
    while (true) {
      let nextLocation = null;
      for (let i = 0; i < height; i += 1) {
        const j = visited[i].findIndex((x) => !x);
        if (j >= 0) {
          nextLocation = [i, j];
          break;
        }
      }
      if (nextLocation) {
        sum += floodFill(nextLocation, hasDiscount, visited, visitedFences);
      } else {
        break;
      }
    }

    return sum;
  }

  console.log("Answer, part 1:", calculatePrice(false));
  console.log("Answer, part 2:", calculatePrice(true));
}
