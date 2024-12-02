import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const map = _.compact((await fetchInputForDay(11, 2023)).split("\n")).map(
    (row) => row.split("")
  );
  const emptyRows = _.range(map.length).filter((i) =>
    map[i].every((x) => x === ".")
  );
  const emptyCols = _.range(map[0].length).filter((i) =>
    map.every((row) => row[i] === ".")
  );

  function emptyRowsBetween(a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return emptyRows.filter((i) => min < i && i < max).length;
  }

  function emptyColsBetween(a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return emptyCols.filter((i) => min < i && i < max).length;
  }

  const galaxies = [];
  map.forEach((row, i) => {
    row.forEach((x, j) => {
      if (x === "#") {
        galaxies.push([i, j]);
      }
    });
  });

  console.log(
    _.sum(
      galaxies.flatMap((coords, index) =>
        galaxies
          .slice(index + 1)
          .map(
            (otherCoords) =>
              Math.abs(coords[0] - otherCoords[0]) +
              Math.abs(coords[1] - otherCoords[1]) +
              999999 * emptyRowsBetween(coords[0], otherCoords[0]) +
              999999 * emptyColsBetween(coords[1], otherCoords[1])
          )
      )
    )
  );
}
