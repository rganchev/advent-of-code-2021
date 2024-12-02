import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(6, 2023)).split("\n")).map(
    (line) => line.split(":")[1].trim()
  );
  const [times, distances] = input.map((line) => line.split(/\s+/).map(Number));

  function waysToWin(time, recordDistance) {
    const d = Math.sqrt(time * time - 4 * recordDistance);
    const from = Math.ceil((time - d) / 2);
    const to = Math.floor((time + d) / 2);
    return to - from + 1;
  }

  console.log(
    "Answer, part 1",
    times.reduce((a, time, index) => a * waysToWin(time, distances[index]), 1)
  );

  const [time, recordDistance] = input.map((line) =>
    Number(line.replace(/\s/g, ""))
  );
  console.log("Answer, part 2", waysToWin(time, recordDistance));
}
