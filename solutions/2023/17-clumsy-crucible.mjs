import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const map = _.compact((await fetchInputForDay(17, 2023)).split("\n")).map(
    (line) => line.split("").map(Number)
  );

  function calcPath(minSteps, maxSteps) {
    const paths = map.map((row, i) =>
      row.map((weight, j) => ({
        i,
        j,
        weight,
        from: {
          "0,-1": Infinity,
          "0,1": Infinity,
          "1,0": Infinity,
          "-1,0": Infinity,
        },
      }))
    );

    const q = [];
    _.times(maxSteps - minSteps + 1, (i) => {
      if (i + minSteps < paths[0].length) {
        paths[0][i + minSteps].from["0,-1"] = _.sum(
          paths[0].slice(1, i + minSteps + 1).map((x) => x.weight)
        );
        q.push(paths[0][i + minSteps]);
      }
      if (i + minSteps < paths.length) {
        paths[i + minSteps][0].from["-1,0"] = _.sum(
          _.times(i + minSteps, (k) => paths[k + 1][0].weight)
        );
        q.push(paths[i + minSteps][0]);
      }
    });

    while (q.length > 0) {
      const current = q.shift();
      let dir = [0, 1];
      _.times(4, () => {
        _.times(maxSteps - minSteps + 1, (step) => {
          const neighbourCoords = [
            current.i + dir[0] * (step + minSteps),
            current.j + dir[1] * (step + minSteps),
          ];
          if (
            _.inRange(neighbourCoords[0], 0, paths.length) &&
            _.inRange(neighbourCoords[1], 0, paths[0].length)
          ) {
            const neighbour = paths[neighbourCoords[0]][neighbourCoords[1]];
            const comingFrom = dir.map((coord) => -coord).join(",");
            const orthogonalDirections = [
              [-dir[1], dir[0]],
              [dir[1], -dir[0]],
            ];
            const minOrthogonal = _.min(
              orthogonalDirections.flatMap((dir) => current.from[dir.join(",")])
            );
            const pathWeight = _.sum(
              _.times(
                step + minSteps,
                (j) =>
                  paths[current.i + dir[0] * (j + 1)][
                    current.j + dir[1] * (j + 1)
                  ].weight
              )
            );
            if (minOrthogonal + pathWeight < neighbour.from[comingFrom]) {
              neighbour.from[comingFrom] = minOrthogonal + pathWeight;
              q.push(neighbour);
            }
          }
        });

        dir = [-dir[1], dir[0]];
      });
    }

    const target = paths[paths.length - 1][paths[0].length - 1];
    return _.min(Object.values(target.from).flat());
  }

  console.log("Answer, part 1:", calcPath(1, 3));
  console.log("Answer, part 2:", calcPath(4, 10));
}
