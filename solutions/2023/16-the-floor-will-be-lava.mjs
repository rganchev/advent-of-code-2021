import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

function getOutputDirections(symbol, inputDirection) {
  switch (symbol) {
    case ".":
      return [inputDirection];
    case "/":
      return {
        "0,1": ["-1,0"],
        "1,0": ["0,-1"],
        "0,-1": ["1,0"],
        "-1,0": ["0,1"],
      }[inputDirection];
    case "\\":
      return {
        "0,1": ["1,0"],
        "1,0": ["0,1"],
        "0,-1": ["-1,0"],
        "-1,0": ["0,-1"],
      }[inputDirection];
    case "-":
      return {
        "0,1": ["0,1"],
        "1,0": ["0,-1", "0,1"],
        "0,-1": ["0,-1"],
        "-1,0": ["0,-1", "0,1"],
      }[inputDirection];
    case "|":
      return {
        "0,1": ["-1,0", "1,0"],
        "1,0": ["1,0"],
        "0,-1": ["-1,0", "1,0"],
        "-1,0": ["-1,0"],
      }[inputDirection];
  }
}

export async function solve() {
  const map = _.compact((await fetchInputForDay(16, 2023)).split("\n")).map(
    (line) => line.split("")
  );

  function countEnergized(startTileCoords, startDirection) {
    const tiles = map.map((line, i) =>
      line.map((x, j) => ({
        symbol: x,
        i,
        j,
        beamDirections: [],
      }))
    );
    tiles[startTileCoords[0]][startTileCoords[1]].beamDirections.push(
      startDirection
    );
    const q = [tiles[startTileCoords[0]][startTileCoords[1]]];
    while (q.length > 0) {
      const current = q.shift();
      current.beamDirections.forEach((dir) => {
        getOutputDirections(current.symbol, dir).forEach((outputDir) => {
          const dirCoords = outputDir.split(",").map(Number);
          const neighbourCoords = [
            current.i + dirCoords[0],
            current.j + dirCoords[1],
          ];
          if (
            _.inRange(neighbourCoords[0], 0, tiles.length) &&
            _.inRange(neighbourCoords[1], 0, tiles[0].length)
          ) {
            const neighbour = tiles[neighbourCoords[0]][neighbourCoords[1]];
            if (!neighbour.beamDirections.includes(outputDir)) {
              neighbour.beamDirections.push(outputDir);
              if (!q.includes(neighbour)) q.push(neighbour);
            }
          }
        });
      });
    }

    return _.sum(
      tiles.map(
        (row) => row.filter((beam) => beam.beamDirections.length > 0).length
      )
    );
  }

  console.log("Answer, part 1:", countEnergized([0, 0], "0,1"));

  const top = _.times(map[0].length, (i) => countEnergized([0, i], "1,0"));
  const right = _.times(map.length, (i) =>
    countEnergized([i, map[0].length - 1], "0,-1")
  );
  const bottom = _.times(map[0].length, (i) =>
    countEnergized([map.length - 1, i], "-1,0")
  );
  const left = _.times(map.length, (i) => countEnergized([i, 0], "0,1"));

  console.log("Answer, part 2:", _.max([top, right, bottom, left].flat()));
}
