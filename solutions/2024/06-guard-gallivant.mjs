import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const map = _.compact((await fetchInputForDay(6, 2024)).split("\n")).map((line) =>
    line.split("")
  );

  const initialRow = map.findIndex((line) => line.includes("^"));
  const initialColumn = map[initialRow].indexOf("^");
  let pos = [initialRow, initialColumn];
  let dir = [-1, 0];

  const step = (pos, dir) => [pos[0] + dir[0], pos[1] + dir[1]];
  const dirIndex = (d) => 2 + d[0] + 2 * d[1];

  let next = step(pos, dir);
  while (_.inRange(next[0], 0, map.length) && _.inRange(next[1], 0, map[0].length)) {
    while (map[next[0]][next[1]] === "#") {
      dir = [dir[1], -dir[0]];
      next = step(pos, dir);
    }
    pos = next;
    map[pos[0]][pos[1]] = "X";
    next = step(pos, dir);
  }

  function checkLoop() {
    const visited = map.map((row) => row.map((_) => new Array(5)));
    let pos = [initialRow, initialColumn];
    let dir = [-1, 0];
    visited[pos[0]][pos[1]][dirIndex(dir)] = true;
    let next = step(pos, dir);
    while (_.inRange(next[0], 0, map.length) && _.inRange(next[1], 0, map[0].length)) {
      while (map[next[0]][next[1]] === "#") {
        dir = [dir[1], -dir[0]];
        next = step(pos, dir);
      }
      pos = next;
      if (visited[pos[0]][pos[1]][dirIndex(dir)]) {
        return true;
      }
      visited[pos[0]][pos[1]][dirIndex(dir)] = true;
      next = step(pos, dir);
    }
    return false;
  }

  console.log(
    "Answer, part 1:",
    _.sum(map.map((line) => line.filter((x) => x === "X").length)) + 1
  );

  let count = 0;
  for (let i = 0; i < map.length; i += 1) {
    for (let j = 0; j < map[0].length; j += 1) {
      if (map[i][j] === "X") {
        map[i][j] = "#";
        if (checkLoop()) {
          count += 1;
        }
        map[i][j] = "X";
      }
    }
  }
  console.log("Answer, part 2:", count);
}
