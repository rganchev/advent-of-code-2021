import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

const digits = [
  ["1", 1],
  ["0", 0],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["zero", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
];

export async function solve() {
  const lines = _.compact((await fetchInputForDay(1, 2023)).split("\n"));
  const isNum = (x) => Number.isFinite(Number(x));
  console.log(
    "Answer, part 1:",
    lines
      .map((line) => [...line])
      .map((line) => Number(line.find(isNum) + line.reverse().find(isNum)))
      .reduce((a, b) => a + b)
  );

  function findFirstDigit(line, reverse = false) {
    const l = reverse ? [...line].reverse().join("") : line;
    const ds = reverse
      ? digits.map(([d, n]) => [[...d].reverse().join(""), n])
      : digits;
    return _.minBy(
      ds.filter(([d]) => l.includes(d)),
      ([d]) => l.indexOf(d)
    )[1];
  }

  console.log(
    "Answer, part 2:",
    lines
      .map((line) => 10 * findFirstDigit(line) + findFirstDigit(line, true))
      .reduce((a, b) => a + b)
  );
}
