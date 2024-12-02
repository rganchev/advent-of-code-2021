import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const patterns = _.compact(
    (await fetchInputForDay(13, 2023)).split("\n\n")
  ).map((pattern) =>
    _.compact(pattern.split("\n")).map((row) => row.split(""))
  );

  function findVerticalReflection(pattern, nDifferences = 0) {
    const countDifferences = (i) =>
      _.sum(
        _.range(Math.min(i, pattern[0].length - i)).map(
          (j) => pattern.filter((row) => row[i - 1 - j] !== row[i + j]).length
        )
      );
    return (
      _.range(1, pattern[0].length).find(
        (i) => countDifferences(i) === nDifferences
      ) ?? 0
    );
  }

  function findHorizontalReflection(pattern, nDifferences = 0) {
    const countDifferences = (i) =>
      _.sum(
        _.range(Math.min(i, pattern.length - i)).map(
          (j) =>
            pattern[i - 1 - j].filter((x, index) => x !== pattern[i + j][index])
              .length
        )
      );

    return (
      _.range(1, pattern.length).find(
        (i) => countDifferences(i) === nDifferences
      ) ?? 0
    );
  }

  console.log(
    "Answer, part 1:",
    _.sum(
      patterns.map(
        (pattern) =>
          findVerticalReflection(pattern) +
          100 * findHorizontalReflection(pattern)
      )
    )
  );
  console.log(
    "Answer, part 2:",
    _.sum(
      patterns.map(
        (pattern) =>
          findVerticalReflection(pattern, 1) +
          100 * findHorizontalReflection(pattern, 1)
      )
    )
  );
}
