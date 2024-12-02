import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const almanac = _.compact((await fetchInputForDay(5, 2023)).split("\n\n"));
  const seeds = almanac[0].split(":")[1].trim().split(" ").map(Number);
  const maps = _.tail(almanac).map((mapString) => {
    const lines = _.compact(mapString.split("\n"));
    const [, from, to] = /([a-z]+)-to-([a-z]+) map/.exec(lines[0]);
    const ranges = _.tail(lines).map((line) => line.split(" ").map(Number));
    return { from, to, ranges };
  });

  function mapSeedToLocation(seed) {
    let currentType = "seed";
    let currentNumber = seed;
    do {
      const map = maps.find((m) => m.from === currentType);
      const range = map.ranges.find((range) =>
        _.inRange(currentNumber, range[1], range[1] + range[2])
      );
      currentType = map.to;
      currentNumber = range
        ? currentNumber - range[1] + range[0]
        : currentNumber;
    } while (currentType !== "location");
    return currentNumber;
  }

  const seedLocations = seeds.map(mapSeedToLocation);
  console.log("Answer, part 1:", _.min(seedLocations));

  function intersectRanges(a, b) {
    const bStart = b[1];
    const bEnd = b[1] + b[2] - 1;
    if (bStart > a.end || bEnd < a.start) {
      return [null, [a]];
    }
    const bAdd = b[0] - b[1];
    const intersectionStart = Math.max(a.start, bStart);
    const intersectionEnd = Math.min(a.end, bEnd);
    const destinationRange = {
      start: intersectionStart + bAdd,
      end: intersectionEnd + bAdd,
    };
    const remainingRanges = [];
    if (a.start < intersectionStart) {
      remainingRanges.unshift({
        start: a.start,
        end: intersectionStart - 1,
      });
    }
    if (a.end > intersectionEnd) {
      remainingRanges.push({
        start: intersectionEnd + 1,
        end: a.end,
      });
    }
    return [destinationRange, remainingRanges];
  }

  let ranges = seeds
    .map((s, i) => ({ start: s, end: s + (seeds[i + 1] ?? 0) - 1 }))
    .filter((s, i) => i % 2 === 0);

  maps.forEach(({ ranges: mappedRanges }) => {
    const destinationRanges = [];
    mappedRanges.forEach((mappedRange) => {
      ranges = ranges.flatMap((range) => {
        const [dest, remaining] = intersectRanges(range, mappedRange);
        if (dest) {
          destinationRanges.push(dest);
        }
        return remaining;
      });
    });
    ranges = ranges.concat(destinationRanges);
  });

  console.log("Answer, part 2:", _.min(ranges.map((r) => r.start)));
}
