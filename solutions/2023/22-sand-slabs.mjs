import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const bricks = _.compact((await fetchInputForDay(22, 2023)).split("\n"))
    .map((line) =>
      line
        .split("~")
        .map((x) => x.split(",").map(Number))
        .sort((a, b) => _.sum(a) - _.sum(b))
    )
    .map(([start, end]) => ({
      start: { x: start[0], y: start[1], z: start[2] },
      end: { x: end[0], y: end[1], z: end[2] },
      support: [],
    }))
    .sort((a, b) => a.start.z - b.start.z);

  bricks.forEach((brick, i) => {
    const overlappingBricks = bricks
      .slice(0, i)
      .filter(({ start: otherStart, end: otherEnd }) => {
        for (let x = brick.start.x; x <= brick.end.x; x += 1) {
          for (let y = brick.start.y; y <= brick.end.y; y += 1) {
            if (
              _.inRange(x, otherStart.x, otherEnd.x + 1) &&
              _.inRange(y, otherStart.y, otherEnd.y + 1)
            ) {
              return true;
            }
          }
        }
      });
    const maxZ = _.max(overlappingBricks.map((b) => b.end.z)) ?? 0;
    const height = brick.end.z - brick.start.z;
    brick.start.z = maxZ + 1;
    brick.end.z = brick.start.z + height;
    brick.support = overlappingBricks.filter((b) => b.end.z === maxZ);
  });

  console.log(
    "Answer, part 1:",
    bricks.filter((brick) =>
      bricks.every(
        (other) => !other.support.includes(brick) || other.support.length > 1
      )
    ).length
  );

  function calcSupported(brick) {
    const falling = new Set([brick]);
    while (true) {
      const alsoFalling = bricks.filter(
        (other) =>
          !falling.has(other) &&
          other.support.length > 0 &&
          other.support.every((x) => falling.has(x))
      );
      if (alsoFalling.length === 0) break;
      alsoFalling.forEach((x) => falling.add(x));
    }
    return falling.size - 1;
  }

  console.log("Answer, part 2:", _.sum(bricks.map(calcSupported)));
}
