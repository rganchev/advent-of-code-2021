import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const map = _.compact((await fetchInputForDay(23, 2023)).split("\n")).map((line) =>
    line.split("")
  );
  const start = [0, map[0].findIndex((x) => x === ".")];
  const end = [map.length - 1, map[map.length - 1].findIndex((x) => x === ".")];

  function findLongestPath() {
    const neighbourDirs = map.map((row) => row.map(() => null));
    const path = [start];
    let maxPath = 0;

    function isValidNeighbour(coords, dir) {
      const nextCoords = [coords[0] + dir[0], coords[1] + dir[1]];
      return (
        _.inRange(nextCoords[0], 0, map.length) &&
        _.inRange(nextCoords[1], 0, map[0].length) &&
        !path.find((c) => c[0] === nextCoords[0] && c[1] === nextCoords[1]) &&
        map[nextCoords[0]][nextCoords[1]] !== "#" &&
        (dir[0] !== -1 || map[nextCoords[0]][nextCoords[1]] !== "v") &&
        (dir[1] !== -1 || map[nextCoords[0]][nextCoords[1]] !== ">")
      );
    }

    while (path.length > 0) {
      const current = _.last(path);
      if (current[0] === end[0] && current[1] === end[1]) {
        maxPath = Math.max(path.length - 1, maxPath);
        path.pop();
        neighbourDirs[current[0]][current[1]] = null;
      } else if ([">", "v"].includes(map[current[0]][current[1]])) {
        if (!neighbourDirs[current[0]][current[1]]) {
          const dir = map[current[0]][current[1]] === ">" ? [0, 1] : [1, 0];
          neighbourDirs[current[0]][current[1]] = dir;
          path.push([current[0] + dir[0], current[1] + dir[1]]);
        } else {
          path.pop();
          neighbourDirs[current[0]][current[1]] = null;
        }
      } else {
        const prevNeighbourDir = neighbourDirs[current[0]][current[1]];
        if (prevNeighbourDir?.[0] === 1 && prevNeighbourDir?.[1] === 0) {
          path.pop();
          neighbourDirs[current[0]][current[1]] = null;
        } else {
          let neighbourDir = prevNeighbourDir
            ? [-prevNeighbourDir[1], prevNeighbourDir[0]]
            : [0, 1];
          while (
            !isValidNeighbour(current, neighbourDir) &&
            (neighbourDir[0] !== 1 || neighbourDir[1] !== 0)
          ) {
            neighbourDir = [-neighbourDir[1], neighbourDir[0]];
          }
          if (isValidNeighbour(current, neighbourDir)) {
            neighbourDirs[current[0]][current[1]] = neighbourDir;
            path.push([current[0] + neighbourDir[0], current[1] + neighbourDir[1]]);
          } else {
            path.pop();
            neighbourDirs[current[0]][current[1]] = null;
          }
        }
      }
    }

    return maxPath;
  }

  console.log("Answer, part 1:", findLongestPath());

  function neighbours(coords, omit = []) {
    let dir = [0, 1];
    return _.times(4, () => {
      dir = [-dir[1], dir[0]];
      return [coords[0] + dir[0], coords[1] + dir[1]];
    }).filter(
      ([i, j]) =>
        _.inRange(i, 0, map.length) &&
        _.inRange(j, 0, map[0].length) &&
        map[i][j] !== "#" &&
        !omit.find(([k, l]) => k === i && l === j)
    );
  }

  const graph = map.map((row, i) => row.map((x, j) => ({ i, j, weight: 1, adj: [] })));
  let q = [start];
  let index = 0;
  while (index < q.length) {
    const current = q[index];
    index += 1;
    const nbrs = neighbours(current);
    const currentNode = graph[current[0]][current[1]];
    nbrs.forEach((nbr) => {
      const adjNode = graph[nbr[0]][nbr[1]];
      if (!currentNode.adj.includes(adjNode)) currentNode.adj.push(adjNode);
      if (!adjNode.adj.includes(currentNode)) adjNode.adj.push(currentNode);
      if (!q.find(([i, j]) => i === nbr[0] && j === nbr[1])) {
        q.push(nbr);
      }
    });
  }

  const startNode = graph[start[0]][start[1]];
  graph[end[0]][end[1]].isEnd = true;

  function collapse(node) {
    node.collapsed = true;
    if (node.adj.length > 2) return;
    while (true) {
      const next = node.adj.find((x) => !x.collapsed && x.adj.length === 2);
      if (!next) {
        return;
      }
      if (next.isEnd) {
        node.isEnd = true;
      }
      next.adj
        .filter((x) => x !== node)
        .forEach((other) => {
          other.adj = other.adj.map((x) => (x === next ? node : x));
        });
      node.adj = [...node.adj.filter((x) => x !== next), ...next.adj.filter((x) => x !== node)];
      node.weight += next.weight;
    }
  }

  q = [startNode];
  while (q.length > 0) {
    const current = q.shift();
    collapse(current);
    current.adj.filter((n) => !n.collapsed && !q.includes(n)).forEach((n) => q.push(n));
  }

  const path = [startNode];
  let maxPath = 0;
  function traverse() {
    const current = _.last(path);
    if (current.isEnd) {
      maxPath = Math.max(maxPath, _.sum(path.map((x) => x.weight)));
    } else {
      current.adj
        .filter((adj) => !path.includes(adj))
        .forEach((adj) => {
          path.push(adj);
          traverse();
          path.pop();
        });
    }
  }
  traverse();
  console.log("Answer, part 2:", maxPath - 1);
}
