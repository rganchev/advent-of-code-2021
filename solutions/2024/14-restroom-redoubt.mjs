import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(14, 2024)).split("\n")).map((line) => ({
    p: /p=([\d-]+),([\d-]+)/.exec(line).slice(1).map(Number),
    v: /v=([\d-]+),([\d-]+)/.exec(line).slice(1).map(Number),
  }));

  const height = 103;
  const width = 101;
  const seconds = 100;

  function calc(coord, velocity, mod, seconds) {
    return (coord + seconds * (mod + velocity)) % mod;
  }

  const positions = input.map(({ p, v }) => [
    calc(p[0], v[0], width, seconds),
    calc(p[1], v[1], height, seconds),
  ]);

  const q1 = positions.filter(
    ([x, y]) => x > Math.floor(width / 2) && y < Math.floor(height / 2)
  ).length;
  const q2 = positions.filter(
    ([x, y]) => x < Math.floor(width / 2) && y < Math.floor(height / 2)
  ).length;
  const q3 = positions.filter(
    ([x, y]) => x < Math.floor(width / 2) && y > Math.floor(height / 2)
  ).length;
  const q4 = positions.filter(
    ([x, y]) => x > Math.floor(width / 2) && y > Math.floor(height / 2)
  ).length;

  console.log("Answer, part 1:", q1 * q2 * q3 * q4);

  function maybeChristmasTree(positions) {
    const middle = positions.filter(
      ([x, y]) =>
        _.inRange(x, 0.25 * width, 0.75 * width) && _.inRange(y, 0.25 * height, 0.75 * height)
    ).length;
    return middle / positions.length > 0.7;
  }

  function print(positions) {
    const pic = _.times(height, () => new Array(width).fill("."));
    positions.forEach(([x, y]) => (pic[y][x] = "x"));
    console.log(pic.map((line) => line.join("")).join("\n"));
  }

  let i = 0;
  let isChristmasTree = false;
  do {
    i += 1;
    const positions = input.map(({ p, v }) => [
      calc(p[0], v[0], width, i),
      calc(p[1], v[1], height, i),
    ]);
    isChristmasTree = maybeChristmasTree(positions);
    // if (isChristmasTree) print(positions);
  } while (!isChristmasTree);

  console.log("Answer, part 2:", i);
}
