import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = (await fetchInputForDay(13, 2024))
    .split("\n\n")
    .map((block) => _.compact(block.split("\n")))
    .map((lines) => ({
      a: /X\+(\d+), Y\+(\d+)/.exec(lines[0]).slice(1).map(Number),
      b: /X\+(\d+), Y\+(\d+)/.exec(lines[1]).slice(1).map(Number),
      prize: /X=(\d+), Y=(\d+)/.exec(lines[2]).slice(1).map(Number),
    }));

  function calcTokens({ a, b, prize }) {
    const m = (prize[1] * b[0] - prize[0] * b[1]) / (a[1] * b[0] - a[0] * b[1]);
    const n = (prize[0] - m * a[0]) / b[0];
    return Number.isInteger(m) && Number.isInteger(n) && m > 0 && n > 0 ? 3 * m + n : 0;
  }

  console.log("Answer, part 1:", _.sum(input.map(calcTokens)));
  console.log(
    "Answer, part 2:",
    _.sum(
      input
        .map((game) => ({
          ...game,
          prize: [game.prize[0] + 10000000000000, game.prize[1] + 10000000000000],
        }))
        .map(calcTokens)
    )
  );
}
