import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(10, 2024)).split("\n")).map((line) =>
    line.split("").map(Number)
  );

  function countReachableHills(i, j, countMultiplicity = false) {
    const stack = [[i, j]];
    const reachableHills = {};
    while (stack.length > 0) {
      const [curI, curJ] = stack.pop();
      if (input[curI][curJ] === 9) {
        const hash = curI * input[0].length + curJ;
        reachableHills[hash] ??= 0;
        reachableHills[hash] += 1;
      }

      let dir = [-1, 0];
      _.times(4, () => {
        const [adjI, adjJ] = [curI + dir[0], curJ + dir[1]];
        if (
          _.inRange(adjI, 0, input.length) &&
          _.inRange(adjJ, 0, input[0].length) &&
          input[adjI][adjJ] === input[curI][curJ] + 1
        ) {
          stack.push([adjI, adjJ]);
        }
        dir = [dir[1], -dir[0]];
      });
    }

    return countMultiplicity
      ? _.sum(Object.values(reachableHills))
      : Object.keys(reachableHills).length;
  }

  console.log(
    "Answer, part 1:",
    _.sum(input.flatMap((line, i) => line.map((x, j) => (x === 0 ? countReachableHills(i, j) : 0))))
  );
  console.log(
    "Answer, part 2:",
    _.sum(
      input.flatMap((line, i) =>
        line.map((x, j) => (x === 0 ? countReachableHills(i, j, true) : 0))
      )
    )
  );
}
