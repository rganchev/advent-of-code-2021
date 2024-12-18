import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";
import { add, decode, encode, rotateLeft } from "../../utils.mjs";

export async function solve() {
  const input = _.compact((await fetchInputForDay(18, 2024)).split("\n")).map((line) =>
    line.split(",").map(Number)
  );
  const area = _.times(71, () => new Array(71).fill("."));
  input.slice(0, 1024).forEach(([j, i]) => (area[i][j] = "#"));

  function dijkstra(start, end) {
    const unvisited = new Map([[encode(start), 0]]);
    const visited = new Set();
    const shortestPathParents = new Map([[encode(start), null]]);

    while (unvisited.size > 0) {
      let next = [null, Infinity];
      for (const entry of unvisited.entries()) {
        if (entry[1] < next[1]) next = entry;
      }

      if (!Number.isFinite(next[1])) break;

      unvisited.delete(next[0]);
      visited.add(next[0]);

      const [pos] = decode(next[0]);
      if (_.isEqual(pos, end)) {
        const shortestPath = new Set();
        let cur = encode(end);
        while (cur) {
          shortestPath.add(cur);
          cur = shortestPathParents.get(cur);
        }
        return shortestPath;
      }

      let dir = [0, 1];
      const adjDist = next[1] + 1;
      _.times(4, () => {
        const adj = add(pos, dir);
        const adjKey = encode(adj);
        if (
          !visited.has(adjKey) &&
          area[adj[0]]?.[adj[1]] === "." &&
          adjDist < (unvisited.get(adjKey) ?? Infinity)
        ) {
          unvisited.set(adjKey, adjDist);
          shortestPathParents.set(adjKey, next[0]);
        }
        dir = rotateLeft(dir);
      });
    }

    return null;
  }

  let shortestPath = dijkstra([0, 0], [70, 70]);
  console.log("Answer, part 1:", shortestPath.size);

  const restBytes = input.slice(1024);
  let nextByte;
  do {
    nextByte = restBytes.shift();
    area[nextByte[1]][nextByte[0]] = "#";
    if (shortestPath.has(encode(nextByte.toReversed()))) {
      shortestPath = dijkstra([0, 0], [70, 70]);
    }
  } while (shortestPath);

  console.log("Answer, part 2:", nextByte.join(","));
}
