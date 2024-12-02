import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const map = _.compact((await fetchInputForDay(21, 2023)).split("\n")).map((line) =>
    line.split("")
  );
  const startI = map.findIndex((row) => row.includes("S"));
  const startJ = map[startI].indexOf("S");
  map[startI][startJ] = ".";

  const gridSize = 11;
  const grid = createGrid(map, gridSize);

  const gridStartI = Math.floor(gridSize / 2) * map.length + startI;
  const gridStartJ = Math.floor(gridSize / 2) * map[0].length + startJ;
  grid[gridStartI][gridStartJ] = 0;
  const q = [[gridStartI, gridStartJ]];
  while (q.length > 0) {
    const current = q.shift();
    let dir = [0, 1];
    _.times(4, () => {
      const neighbourCoords = [current[0] + dir[0], current[1] + dir[1]];
      if (
        _.inRange(neighbourCoords[0], 0, grid.length) &&
        _.inRange(neighbourCoords[1], 0, grid[0].length) &&
        grid[neighbourCoords[0]][neighbourCoords[1]] === "."
      ) {
        grid[neighbourCoords[0]][neighbourCoords[1]] = grid[current[0]][current[1]] + 1;
        q.push(neighbourCoords);
      }
      dir = [-dir[1], dir[0]];
    });
  }

  console.log(
    "Answer, part 1:",
    _.sum(
      grid.map((row) => row.filter((x) => Number.isFinite(x) && x % 2 === 1 && x <= 458).length)
    )
  );

  function createGrid(tile, size) {
    return _.times(tile.length * size, (i) =>
      _.times(size, () => tile[i % tile.length].map((x) => x)).flat()
    );
  }

  function interpolate(p0, p1, p2) {
    const c = p0;
    const a = (p2 - 2 * p1 + c) / 2;
    const b = p1 - a - c;

    return function P(x) {
      return a * x * x + b * x + c;
    };
  }

  console.log("Answer, part 2:", interpolate(3784, 93366, 302108)(101150));
}

// 202300 * 2 + 1 = 404601,  * 404601 = 163701969201
// 81850984600 * 7495 = 613473129577000
// 81850984601 * 7400 = 605697286047400

// 609585207812200

// total steps: 202,300 * 131 + 65
// fully reachable: 202, 299
// (1 + 202,299) * 202,299 / 2 = 101,150 * 202,299 = 20462543850 * 4 = 81850175400

// 302 845 648 980 000
// 306 733 532 311 500
// ----
// 609 579 181 291 500 fully reachable

// 609579181324859

// 3784, 33359, 93366, 182093, 302108, 449987, 630010

// 2266 unreachable

// P(x) = ax^2 + bx + c
// P(0) = c = 3784
// P(1) = a + b + c = 33359
// P(2) = 4a + 2b + c = 93366

// P(2) - 2*P(1) = 4a + 2b + c - 2a - 2b - 2c = 2a - c => a = (P(2) - 2*P(1) + c) / 2 = (93366 - 2*33359 + 3784) / 2 = 15216
// b = P(1) - a - c = 33359 - 15216 - 3784 = 14359

// a = (P(2) + c - 2*P(1)) / 2 = (93366 + 3784 - 2 * 33359) / 2 = 15216
// b = 33359- 3784 - 15,216 = 14359
// P(3) = 9 * 15216 + 3 * 14359 + 3784

// 15216 * 202300^2 + 14359 * 202300 + 3784

622719212640000 + 2904825700 + 3784;

622722117469484;
