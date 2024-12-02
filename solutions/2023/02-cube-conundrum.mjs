import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const games = _.compact((await fetchInputForDay(2, 2023)).split("\n"))
    .map((game) => game.split(/:\s*/)[1].split(/;\s*/))
    .map((draws) =>
      draws.map((draw) =>
        _.mapValues(
          Object.fromEntries(
            draw.split(/,\s*/).map((cubes) => cubes.split(/\s+/).reverse())
          ),
          Number
        )
      )
    );
  let answerPart1 = 0;
  games.forEach((game, index) => {
    if (
      game.every(
        (draw) =>
          (draw.red ?? 0) <= 12 &&
          (draw.green ?? 0) <= 13 &&
          (draw.blue ?? 0) <= 14
      )
    ) {
      answerPart1 += index + 1;
    }
  });
  console.log("Answer, part 1: ", answerPart1);

  console.log(
    "Answer, part 2: ",
    _.sum(
      games.map(
        (draws) =>
          _.max(draws.map((draw) => draw.red ?? 1)) *
          _.max(draws.map((draw) => draw.green ?? 1)) *
          _.max(draws.map((draw) => draw.blue ?? 1))
      )
    )
  );
}
