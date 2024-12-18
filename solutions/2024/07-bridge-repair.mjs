import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(7, 2024)).split("\n")).map((line) =>
    line.split(/\D+/).map(Number)
  );

  function check([total, ...operands], checkConcatenation) {
    if (operands.length === 1) return total === operands[0];

    const last = operands.pop();
    return (
      (total % last === 0 && check([total / last, ...operands], checkConcatenation)) ||
      (total >= last && check([total - last, ...operands], checkConcatenation)) ||
      (checkConcatenation &&
        `${total}`.endsWith(`${last}`) &&
        check([Number(`${total}`.slice(0, -`${last}`.length)), ...operands], checkConcatenation))
    );
  }

  console.log(
    "Answer, part 1:",
    _.sum(input.filter((line) => check(line, false)).map((line) => line[0]))
  );
  console.log(
    "Answer, part 2:",
    _.sum(input.filter((line) => check(line, true)).map((line) => line[0]))
  );
}
