import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const lines = _.compact((await fetchInputForDay(1, 2024)).split("\n")).map((line) =>
    line.split(/\s+/).map(Number)
  );
  const [left, right] = _.unzip(lines).map((arr) => arr.sort());
  const diff = _.sum(left.map((x, i) => Math.abs(x - right[i])));
  console.log("Answer, part 1:", diff);

  const counts = _.countBy(right);
  const similarity = _.sum(left.map((x) => x * (counts[`${x}`] ?? 0)));
  console.log("Answer, part 2:", similarity);
}
