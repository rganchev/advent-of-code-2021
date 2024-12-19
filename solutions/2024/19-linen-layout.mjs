import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const [towelsInput, designsInput] = _.compact((await fetchInputForDay(19, 2024)).split("\n\n"));
  const towels = towelsInput.split(", ");
  const designs = _.compact(designsInput.split("\n"));
  const arrangements = new Map([["", 1]]);

  function countArrangements(design) {
    if (arrangements.has(design)) return arrangements.get(design);

    let total = 0;
    for (const towel of towels) {
      if (design.startsWith(towel)) {
        total += countArrangements(design.slice(towel.length));
      }
    }

    arrangements.set(design, total);
    return total;
  }

  console.log("Answer, part 1:", designs.filter((design) => countArrangements(design) > 0).length);
  console.log("Answer, part 2:", _.sum(designs.map(countArrangements)));
}
