import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const cardOrder = "23456789TJQKA";
  const hands = _.compact((await fetchInputForDay(7, 2023)).split("\n"))
    .map((line) => line.split(" "))
    .map(([cards, bid]) => ({
      cards: [...cards].map((c) => cardOrder.indexOf(c)),
      bid: Number(bid),
    }));

  function determineType(hand, useJokers = false) {
    const cards = new Map();
    hand.forEach((card) => {
      if (!cards.has(card)) {
        cards.set(card, 0);
      }
      cards.set(card, cards.get(card) + 1);
    });
    if (useJokers && cards.has(9)) {
      const nJokers = cards.get(9);
      cards.delete(9);
      if (nJokers === 5) {
        cards.set(0, 5);
      } else {
        const [maxCard, n] = _.maxBy([...cards.entries()], (entry) => entry[1]);
        cards.set(maxCard, n + nJokers);
      }
    }
    switch (cards.size) {
      case 5:
        return 0;
      case 4:
        return 1;
      case 3:
        return [...cards.values()].some((v) => v === 3) ? 3 : 2;
      case 2:
        return [...cards.values()].some((v) => v === 4) ? 5 : 4;
      case 1:
        return 6;
    }
  }

  function compare(hand1, hand2, useJokers = false) {
    let [h1, h2] = [[...hand1], [...hand2]];
    if (useJokers) {
      h1 = h1.map((c) => (c === 9 ? 0 : c + 1));
      h2 = h2.map((c) => (c === 9 ? 0 : c + 1));
    }

    for (const i in h1) {
      if (h1[i] !== h2[i]) {
        return h1[i] - h2[i];
      }
    }
    return 0;
  }
  hands.forEach((hand) => (hand.type = determineType(hand.cards)));
  hands.sort((a, b) => {
    if (a.type === b.type) return compare(a.cards, b.cards);
    return a.type - b.type;
  });

  console.log(
    "Answer, part 1:",
    hands.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0)
  );

  hands.forEach((hand) => (hand.type = determineType(hand.cards, true)));
  hands.sort((a, b) => {
    if (a.type === b.type) return compare(a.cards, b.cards, true);
    return a.type - b.type;
  });
  console.log(
    "Answer, part 2:",
    hands.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0)
  );
}
