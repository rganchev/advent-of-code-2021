import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const cards = _.compact((await fetchInputForDay(4, 2023)).split("\n"))
    .map((card) =>
      card
        .split(":")[1]
        .split("|")
        .map((section) => section.trim())
    )
    .map(([winning, drawn]) => {
      const winningNumbers = new Set(winning.split(/\s+/).map(Number));
      const drawnNumbers = drawn.split(/\s+/).map(Number);
      return {
        n: 1,
        matches: drawnNumbers.filter((num) => winningNumbers.has(num)).length,
      };
    });

  console.log(
    "Answer, part 1:",
    _.sum(
      cards
        .filter((card) => card.matches > 0)
        .map((card) => 1 << (card.matches - 1))
    )
  );

  cards.forEach((card, index) => {
    for (let i = 0; i < card.matches; i += 1) {
      cards[index + i + 1].n += card.n;
    }
  });

  console.log("Answer, part 1:", _.sum(cards.map((card) => card.n)));
}
