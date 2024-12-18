import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(8, 2024)).split("\n")).map((line) =>
    line.split("")
  );

  const antennas = {};
  input.forEach((line, i) =>
    line.forEach((x, j) => {
      if (x !== ".") {
        antennas[x] ??= [];
        antennas[x].push([i, j]);
      }
    })
  );

  function countAntinodes(withHarmonics) {
    const antinodes = _.times(input.length, () => new Array(input[0].length).fill(0));
    Object.entries(antennas).forEach(([name, locations]) => {
      locations.forEach(([i1, j1], index) =>
        locations.slice(index + 1).forEach(([i2, j2]) => {
          const di = i2 - i1;
          const dj = j2 - j1;
          let n = withHarmonics ? 0 : 1;
          let prevInRange, nextInRange;
          do {
            prevInRange =
              _.inRange(i1 - n * di, 0, antinodes.length) &&
              _.inRange(j1 - n * dj, 0, antinodes[0].length);
            nextInRange =
              _.inRange(i2 + n * di, 0, antinodes.length) &&
              _.inRange(j2 + n * dj, 0, antinodes[0].length);

            if (prevInRange) antinodes[i1 - n * di][j1 - n * dj] = 1;
            if (nextInRange) antinodes[i2 + n * di][j2 + n * dj] = 1;

            n += 1;
          } while (withHarmonics && (prevInRange || nextInRange));
        })
      );
    });

    return _.sum(antinodes.map((line) => _.sum(line)));
  }

  console.log("Answer, part 1:", countAntinodes(false));
  console.log("Answer, part 2:", countAntinodes(true));
}
