import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

const test = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const moveDirs = {
  "^": [-1, 0],
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
};

export async function solve() {
  // const [mapInput, moveInput] = _.compact(test.split("\n\n"));
  const [mapInput, moveInput] = _.compact((await fetchInputForDay(15, 2024)).split("\n\n"));
  const map = mapInput.split("\n").map((line) => line.split(""));
  const moves = _.compact(moveInput.split("\n")).flatMap((line) => line.split(""));

  const add = (p, v) => [p[0] + v[0], p[1] + v[1]];
  const get = (map, pos) => map[pos[0]][pos[1]];
  const set = (map, pos, value) => (map[pos[0]][pos[1]] = value);

  function sumCoords(map, symbol) {
    return _.sum(map.flatMap((line, i) => line.map((x, j) => (x === symbol ? 100 * i + j : 0))));
  }

  function solve1() {
    const mapCopy = map.map((line) => [...line]);
    const startI = mapCopy.findIndex((line) => line.includes("@"));
    const startJ = mapCopy[startI].findIndex((x) => x === "@");
    let pos = [startI, startJ];

    moves.forEach((move) => {
      const dir = moveDirs[move];
      let nextPos = add(pos, dir);
      while (get(mapCopy, nextPos) === "O") nextPos = add(nextPos, dir);

      if (get(mapCopy, nextPos) === ".") {
        set(mapCopy, pos, ".");
        set(mapCopy, nextPos, "O");
        pos = add(pos, dir);
        set(mapCopy, pos, "@");
      }
    });

    return sumCoords(mapCopy, "O");
  }

  function solve2() {
    const mapping = {
      "#": () => ["#", "#"],
      O: () => ["[", "]"],
      ".": () => [".", "."],
      "@": () => ["@", "."],
    };
    const mapCopy = map.map((line) => line.flatMap((x) => mapping[x]()));
    const startI = mapCopy.findIndex((line) => line.includes("@"));
    const startJ = mapCopy[startI].findIndex((x) => x === "@");
    let pos = [startI, startJ];

    function doMove(positions, dir) {
      const nextPositions = [];
      for (const pos of positions) {
        const nextPos = add(pos, dir);
        const nextSymbol = get(mapCopy, nextPos);
        if (nextSymbol === "#") return false;

        if (["[", "]"].includes(nextSymbol)) {
          if (!nextPositions.find((p) => _.isEqual(nextPos, p))) {
            nextPositions.push(nextPos);
          }
          if (dir[0] !== 0) {
            const adjPos = [nextPos[0], nextPos[1] + (nextSymbol === "]" ? -1 : 1)];
            if (!nextPositions.find((p) => _.isEqual(adjPos, p))) {
              nextPositions.push(adjPos);
            }
          }
        }
      }

      if (nextPositions.length > 0 && !doMove(nextPositions, dir)) return false;

      for (const pos of positions) {
        set(mapCopy, add(pos, dir), get(mapCopy, pos));
        set(mapCopy, pos, ".");
      }

      return true;
    }

    moves.forEach((move) => {
      const dir = moveDirs[move];
      if (doMove([pos], dir)) {
        pos = add(pos, dir);
      }
    });

    return sumCoords(mapCopy, "[");
  }

  console.log("Answer, part 1:", solve1());
  console.log("Answer, part 2:", solve2());
}
