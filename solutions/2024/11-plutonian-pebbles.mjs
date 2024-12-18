import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const stones = (await fetchInputForDay(11, 2024)).trim().split(/\s/).map(Number);

  function splitStone(stone) {
    if (stone === 0) return [1];
    const str = String(stone);
    if (str.length % 2 === 0)
      return [Number(str.slice(0, str.length / 2)), Number(str.slice(str.length / 2))];

    return [stone * 2024];
  }

  function blink(counts) {
    const newCounts = new Map();
    for (const [stone, count] of counts.entries()) {
      for (const result of splitStone(stone)) {
        newCounts.set(result, (newCounts.get(result) ?? 0) + count);
      }
    }
    return newCounts;
  }

  let counts = new Map(stones.map((s) => [s, 1]));

  _.times(25, () => (counts = blink(counts)));
  console.log("Answer, part 1:", _.sum([...counts.values()]));

  _.times(50, () => (counts = blink(counts)));
  console.log("Answer, part 2:", _.sum([...counts.values()]));
}
