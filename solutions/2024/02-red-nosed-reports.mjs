import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const lines = _.compact((await fetchInputForDay(2, 2024)).split("\n")).map((line) =>
    line.split(/\s+/).map(Number)
  );

  function isSafe(levels, recurse = false) {
    const diffs = levels.slice(1).map((x, i) => x - levels[i]);
    const sign = Math.sign(diffs[0]);
    return (
      diffs.map((x) => x * sign).every((x) => 1 <= x && x <= 3) ||
      (recurse && _.times(levels.length, (i) => levels.toSpliced(i, 1)).some((l) => isSafe(l)))
    );
  }

  console.log("Answer, part 1:", lines.filter((levels) => isSafe(levels)).length);
  console.log("Answer, part 2:", lines.filter((levels) => isSafe(levels, true)).length);
}
