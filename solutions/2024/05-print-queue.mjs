import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const [rules, updates] = (await fetchInputForDay(5, 2024))
    .split("\n\n")
    .map((section) => _.compact(section.split("\n")).map((line) => line.split(/[,|]/).map(Number)));

  const sortablePages = new Set(rules.flat());

  function process(update) {
    const updatePages = new Set(update);
    const updateRules = rules.filter(([a, b]) => updatePages.has(a) && updatePages.has(b));
    const successionRules = new Map(
      [...updatePages].map((page) => [page, updateRules.filter(([a, b]) => b === page).length])
    );
    const sortOrder = [];
    while (successionRules.size > 0) {
      const [unpreceededPage] = [...successionRules.entries()].find(([a, b]) => b === 0);
      sortOrder.push(unpreceededPage);
      successionRules.delete(unpreceededPage);
      for (const [page, nSuccessions] of successionRules.entries()) {
        successionRules.set(
          page,
          nSuccessions - updateRules.filter(([a, b]) => a === unpreceededPage && b === page).length
        );
      }
    }

    for (let i = 0; i < update.length; i += 1) {
      if (sortOrder[i] !== update[i]) return [false, sortOrder];
    }
    return [true, sortOrder];
  }

  console.log(
    "Answer, part 1:",
    _.sum(updates.filter((x) => process(x)[0]).map((u) => u[Math.floor(u.length / 2)]))
  );

  console.log(
    "Answer, part 2:",
    _.sum(
      updates
        .map(process)
        .filter(([a, b]) => !a)
        .map(([a, b]) => b[Math.floor(b.length / 2)])
    )
  );
}
