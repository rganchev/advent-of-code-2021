import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const connections = {
    north: "|JL",
    west: "-J7",
    south: "|7F",
    east: "-FL",
  };
  const oppositeDirection = {
    north: "south",
    west: "east",
    south: "north",
    east: "west",
  };
  const directionCoords = {
    east: [0, 1],
    north: [-1, 0],
    south: [1, 0],
    west: [0, -1],
  };
  // const map = ["..F7.", ".FJ|.", "SJ.L7", "|F--J", "LJ..."];
  const map = _.compact((await fetchInputForDay(10, 2023)).split("\n")).map((row) => row.split(""));
  const startI = map.findIndex((row) => row.includes("S"));
  const startJ = map[startI].indexOf("S");

  const startDirs = Object.keys(directionCoords).filter((dir) =>
    connections[oppositeDirection[dir]].includes(
      map[startI + directionCoords[dir][0]][startJ + directionCoords[dir][1]]
    )
  );
  map[startI][startJ] = [...connections[startDirs[0]]].find((s) =>
    connections[startDirs[1]].includes(s)
  );

  function findNext(coords, comingFromDir) {
    const symbol = map[coords[0]][coords[1]];
    const dir = Object.keys(directionCoords).find(
      (d) => d !== comingFromDir && connections[d].includes(symbol)
    );
    return [dir, [coords[0] + directionCoords[dir][0], coords[1] + directionCoords[dir][1]]];
  }

  const loop = [[[startI, startJ], ...startDirs.map((d) => directionCoords[d])]];
  let fromDir = startDirs[0];
  let [toDir, nextCoords] = findNext([startI, startJ], fromDir);
  while (nextCoords[0] !== startI || nextCoords[1] !== startJ) {
    fromDir = oppositeDirection[toDir];
    const result = findNext(nextCoords, fromDir);
    toDir = result[0];
    loop.push([nextCoords, directionCoords[fromDir], directionCoords[toDir]]);
    nextCoords = result[1];
  }

  console.log("Answer, part 1:", loop.length / 2);

  const area = _.times(map.length, () => _.times(map[0].length, () => "."));
  loop.forEach(([coords]) => (area[coords[0]][coords[1]] = map[coords[0]][coords[1]]));

  loop.forEach(([coords, fromDirCoords, toDirCoords]) => {
    let dirCoords = toDirCoords;
    let side = "l";
    _.times(8, () => {
      if (dirCoords[0] === fromDirCoords[0] && dirCoords[1] === fromDirCoords[1]) {
        side = "r";
      } else if (area[coords[0] + dirCoords[0]][coords[1] + dirCoords[1]] === ".") {
        area[coords[0] + dirCoords[0]][coords[1] + dirCoords[1]] = side;
      }
      dirCoords = [Math.sign(dirCoords[0] - dirCoords[1]), Math.sign(dirCoords[0] + dirCoords[1])];
    });
  });

  let hasMore = true;
  while (hasMore) {
    hasMore = false;
    area.forEach((row, i) => {
      row.forEach((s, j) => {
        if (s === "l" || s === "r") {
          let dir = [0, 1];
          _.times(8, () => {
            if (area[i + dir[0]] && area[i + dir[0]][j + dir[1]] === ".") {
              hasMore = true;
              area[i + dir[0]][j + dir[1]] = s;
            }
            dir = [Math.sign(dir[0] - dir[1]), Math.sign(dir[0] + dir[1])];
          });
        }
      });
    });
  }

  console.log("Answer, part 2:", _.sum(area.map((row) => row.filter((s) => s === "l").length)));
}
