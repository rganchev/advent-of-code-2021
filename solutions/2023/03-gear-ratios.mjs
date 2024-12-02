import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const engine = _.compact((await fetchInputForDay(3, 2023)).split("\n")).map(
    (row) => row.split("")
  );
  const partNumbers = [];
  for (let i = 0; i < engine.length; i += 1) {
    for (let j = 0; j < engine[i].length; j += 1) {
      if (
        /\d/.test(engine[i][j]) &&
        (j === 0 || !/\d/.test(engine[i][j - 1]))
      ) {
        const digits = [];
        let endJ = j;
        while (endJ < engine[i].length && /\d/.test(engine[i][endJ])) {
          digits.push(Number(engine[i][endJ]));
          endJ += 1;
        }
        endJ -= 1;
        let isPartNumber = false;
        for (
          let adjI = Math.max(0, i - 1);
          adjI < Math.min(engine.length, i + 2);
          adjI += 1
        ) {
          for (
            let adjJ = Math.max(0, j - 1);
            adjJ < Math.min(engine[i].length, endJ + 2);
            adjJ += 1
          ) {
            if (/[^\d.]/.test(engine[adjI][adjJ])) {
              isPartNumber = true;
            }
          }
        }
        if (isPartNumber) {
          partNumbers.push({
            num: _.sum(digits.reverse().map((d, i) => d * Math.pow(10, i))),
            row: i,
            startCol: j,
            endCol: endJ,
          });
        }
      }
    }
  }

  console.log("Answer, part 1:", _.sum(partNumbers.map((p) => p.num)));

  let sum = 0;
  for (let i = 0; i < engine.length; i += 1) {
    for (let j = 0; j < engine[i].length; j += 1) {
      if (engine[i][j] === "*") {
        const adjacentPartNumbers = partNumbers.filter(
          (p) =>
            _.inRange(i, p.row - 1, p.row + 2) &&
            _.inRange(j, p.startCol - 1, p.endCol + 2)
        );
        if (adjacentPartNumbers.length === 2) {
          sum += adjacentPartNumbers[0].num * adjacentPartNumbers[1].num;
        }
      }
    }
  }
  console.log("Answer, part 2:", sum);
}
