import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";
import { add, decode, encode, findCoords, rotateLeft, rotateRight } from "../../utils.mjs";

export async function solve() {
  const input = _.compact((await fetchInputForDay(16, 2024)).split("\n")).map((line) =>
    line.split("")
  );

  function findMinPath(start, startDir, end) {
    const unvisited = new Map([[encode(start, startDir), 0]]);
    const visited = new Set();
    const shortestPathParents = new Map([[encode(start, startDir), new Set()]]);

    let result = null;
    while (unvisited.size > 0) {
      let next = [null, Infinity];
      for (const entry of unvisited.entries()) {
        if (entry[1] < next[1]) next = entry;
      }

      if (!Number.isFinite(next[1])) return [Infinity, Infinity];

      unvisited.delete(next[0]);
      visited.add(next[0]);

      const [pos, dir] = decode(next[0]);
      if (_.isEqual(pos, end)) {
        result = next;
        break;
      }

      const forward = [add(pos, dir), dir];
      const left = [pos, rotateLeft(dir)];
      const right = [pos, rotateRight(dir)];
      [forward, left, right].forEach(([nextPos, nextDir]) => {
        if (input[nextPos[0]][nextPos[1]] !== ".") return;

        const key = encode(nextPos, nextDir);
        if (visited.has(key)) return;

        const newDist = next[1] + (_.isEqual(nextPos, pos) ? 1000 : 1);
        const currentDist = unvisited.get(key) ?? Infinity;
        if (newDist < currentDist) {
          unvisited.set(key, newDist);
          shortestPathParents.set(key, new Set([next[0]]));
        } else if (newDist === currentDist) {
          shortestPathParents.get(key).add(next[0]);
        }
      });
    }

    const allOnShortestPath = new Set();
    const stack = [result[0]];
    let count = 0;
    do {
      const key = stack.pop();
      allOnShortestPath.add(encode(decode(key)[0]));
      count += 1;
      for (const k of shortestPathParents.get(key)) stack.push(k);
    } while (stack.length > 0);

    return [result[1], allOnShortestPath.size];
  }

  const start = findCoords(input, "S");
  const end = findCoords(input, "E");
  input[start[0]][start[1]] = input[end[0]][end[1]] = ".";

  const [shortestPath, seatsOnShortestPath] = findMinPath(start, [0, 1], end);
  console.log("Answer, part 1:", shortestPath);
  console.log("Answer, part 2:", seatsOnShortestPath);
}
