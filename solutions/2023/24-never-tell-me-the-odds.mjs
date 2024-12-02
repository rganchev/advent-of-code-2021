import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

const MIN = 200000000000000;
const MAX = 400000000000000;

export async function solve() {
  const stones = _.compact((await fetchInputForDay(24, 2023)).split("\n"))
    .map((line) => line.split(/[@,\s]+/).map(Number))
    .map(([px, py, pz, vx, vy, vz]) => ({ px, py, pz, vx, vy, vz }));

  const lines = stones.map((s) => ({
    a: s.vy / s.vx,
    b: s.py - (s.vy / s.vx) * s.px,
  }));

  console.log(
    "Answer, part 1:",
    lines.reduce(
      (count, line, i) =>
        count +
        lines.slice(i + 1).filter((otherLine, j) => {
          if (line.a === otherLine.a) return false;

          const intersectionX = (otherLine.b - line.b) / (line.a - otherLine.a);
          const intersectionY = line.a * intersectionX + line.b;
          return (
            MIN <= intersectionX &&
            intersectionX <= MAX &&
            MIN <= intersectionY &&
            intersectionY <= MAX &&
            Math.sign(intersectionX - stones[i].px) === Math.sign(stones[i].vx) &&
            Math.sign(intersectionX - stones[i + j + 1].px) === Math.sign(stones[i + j + 1].vx)
          );
        }).length,
      0
    )
  );

  // Look only at pairs of stones having equal vx, for simplicity
  const pairs = _.compact(
    stones
      .sort((a, b) => a.vx - b.vx)
      .slice(1)
      .map((stone, i) => (stone.vx === stones[i].vx ? [stones[i], stone] : null))
  );

  // Assume there exists a pair with a.vx == b.vx and a.px == b.px. It can be shown that that this pair's
  // x coordinate and x velocity match the ones we are looking for (proof in comments below)
  const startPair = pairs.find(([a, b]) => a.px === b.px);
  const x = startPair[0].px;
  const vx = startPair[0].vx;

  // Find another pair of stones and from it compute y, vy, z, and vz.
  const [a, b] = pairs.find(([a, b]) => a.px !== x && a.vx !== vx);
  const vy = Math.round(
    (vx * (a.py - b.py) + a.vx * (b.py - a.py) + a.vy * (a.px - x) + b.vy * (x - b.px)) /
      (a.px - b.px)
  );
  const y = Math.round(a.py + ((a.vy - vy) * (a.px - x)) / (vx - a.vx));
  const vz = Math.round(
    (vx * (a.pz - b.pz) + a.vx * (b.pz - a.pz) + a.vz * (a.px - x) + b.vz * (x - b.px)) /
      (a.px - b.px)
  );
  const z = Math.round(a.pz + ((a.vz - vz) * (a.px - x)) / (vx - a.vx));

  console.log("Answer, part 2:", x + y + z);
}

// ****** Initial conditions:
// ****** Looking for initial coordinates (x, y, z) and velocity (vx, vy, vz) such that
// ****** for any stone (px1, py1, pz1, vx1, vy1, vz1) and some point in time t, we have:
// x + t*vx = px1 + t*vx1     (1)
// y + t*vy = py1 + t*vy1     (2)
// z + t*vz = pz1 + t*vz1     (3)

// ****** From (1) =>
// x + t*(vx - vx1) - px1 = 0
// t = (px1 - x) / (vx - vx1)
// y = py1 + (vy1 - vy) * (px1 - x) / (vx - vx1)    (4)
// z = pz1 + (vz1 - vz) * (px1 - x) / (vx - vx1)    (5)

// ****** If we have a pair of stones (px1, py1, pz1, vx1, vy1, vz1) and (px2, py2, pz2, vx2, vy2, vz2)
// ****** We can express y in two ways from the above equations and equate them:
// py1 + (vy1 - vy) * (px1 - x) / (vx - vx1) = py2 + (vy2 - vy) * (px2 - x) / (vx - vx2)

// ****** If vx1 == vx2 && px1 == px2, then:
// py1 - py2 + (vy1 - vy2) * (px1 - x) / (vx - vx1) = 0     =>
// (vy1 - vy2) * px1 - (vy1 - vy2) * x = (py2 - py1) * vx - (py2 - py1) * vx1
// x = px1 - (py2 - py1) * vx / (vy1 - vy2) + (py2 - py1) * vx1 / (vy1 - vy2)

// ****** Analogously for z:
// pz1 - pz2 + (vz1 - vz2) * (px1 - x) / (vx - vx1) = 0     =>
// x = px1 - (pz2 - pz1) * vx / (vz1 - vz2) + (pz2 - pz1) * vx1 / (vz1 - vz2)

// x = x      =>
// (py2 - py1) * vx / (vy1 - vy2) - (py2 - py1) * vx1 / (vy1 - vy2) = (pz2 - pz1) * vx / (vz1 - vz2) - (pz2 - pz1) * vx1 / (vz1 - vz2)
// (py2 - py1) * vx / (vy1 - vy2) + (pz2 - pz1) * vx / (vz1 - vz2) = (pz2 - pz1) * vx1 / (vz1 - vz2) + (py2 - py1) * vx1 / (vy1 - vy2)
// vx * ((py2 - py1) / (vy1 - vy2) + (pz2 - pz1) / (vz1 - vz2)) = (pz2 - pz1) * vx1 / (vz1 - vz2) + (py2 - py1) * vx1 / (vy1 - vy2)
// vx = vx1 * ((pz2 - pz1) * (vy1 - vy2) + (py2 - py1) * (vz1 - vz2)) / ((py2 - py1) * (vz1 - vz2) + (pz2 - pz1) * (vy1 - vy2))
// vx = vx1     (6)

// x + t*vx = px1 + t*vx1     =>
// x = px1      (7)

// ****** For another pair of stones (px3, py3, pz3, vx3, vy3, vz3) and (px4, py4, pz4, vx4, vy4, vz4)
// ****** If vx3 == vx4, it follows from (4) that:
// py3 - py4 + ((vy3 - vy) * (px3 - x) - (vy4 - vy) * (px4 - x)) / (vx - vx3) = 0
// py3 - py4 + (vy3 * (px3 - x) - vy * (px3 - x) - vy4 * (px4 - x) + vy * (px4 - x)) / (vx - vx3) = 0
// py3 - py4 + (vy3 * (px3 - x) - vy * (px3 - px4) - vy4 * (px4 - x)) / (vx - vx3) = 0
// py3 - py4 + (vy3 * px3 - vy3 * x - vy4 * px4 + vy4 * x) / (vx - vx3) = vy * (px3 - px4) / (vx - vx3)
// (py3 - py4) * (vx - vx3) + (vy3 * px3 - vy3 * x - vy4 * px4 + vy4 * x) = vy * (px3 - px4)
// py3 * vx - py4 * vx - py3 * vx3 + py4 * vx3 + px3 * vy3 - x * vy3 - px4 * vy4 + x * vy4 = vy * (px3 - px4)
// vy = (py3 * vx - py4 * vx - py3 * vx3 + py4 * vx3 + px3 * vy3 - x * vy3 - px4 * vy4 + x * vy4) / (px3 - px4)
// vy = (vx * (py3 - py4) + vx3 * (py4 - py3) + vy3 * (px3 - x) + vy4 * (x - px4)) / (px3 - px4)      (8)

// ****** Analogously for vz:
// pz3 - pz4 + ((vz3 - vz) * (px3 - x) - (vz4 - vz) * (px4 - x)) / (vx - vx3) = 0     =>
// vz = (vx * (pz3 - pz4) + vx3 * (pz4 - pz3) + vz3 * (px3 - x) + vz4 * (x - px4)) / (px3 - px4)      (9)

// ****** In summary, if we have a pair of stones with px1 == px2 && vx1 == vx2 and
// ****** another pair of stones with vx3 == vx4, then the solution is:
// vx = vx1                                                                                           (6)
// x = px1                                                                                            (7)
// vy = (vx * (py3 - py4) + vx3 * (py4 - py3) + vy3 * (px3 - x) + vy4 * (x - px4)) / (px3 - px4)      (8)
// y = py1 + (vy1 - vy) * (px1 - x) / (vx - vx1)                                                      (4)
// vz = (vx * (pz3 - pz4) + vx3 * (pz4 - pz3) + vz3 * (px3 - x) + vz4 * (x - px4)) / (px3 - px4)      (9)
// z = pz1 + (vz1 - vz) * (px1 - x) / (vx - vx1)                                                      (5)
