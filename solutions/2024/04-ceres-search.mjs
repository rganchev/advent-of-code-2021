import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(4, 2024)).split("\n"));
  const dirs = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  let count = 0;
  for (let i = 0; i < input.length; i += 1) {
    for (let j = 0; j < input[0].length; j += 1) {
      if (input[i][j] === "X") {
        for (const [di, dj] of dirs) {
          if (
            input[i + di]?.[j + dj] === "M" &&
            input[i + 2 * di]?.[j + 2 * dj] === "A" &&
            input[i + 3 * di]?.[j + 3 * dj] === "S"
          ) {
            count += 1;
          }
        }
      }
    }
  }
  console.log(`Answer, part 1:`, count);

  count = 0;
  for (let i = 1; i < input.length - 1; i += 1) {
    for (let j = 1; j < input[0].length - 1; j += 1) {
      if (input[i][j] === "A") {
        if (
          ((input[i - 1][j - 1] === "M" && input[i + 1][j + 1] === "S") ||
            (input[i - 1][j - 1] === "S" && input[i + 1][j + 1] === "M")) &&
          ((input[i - 1][j + 1] === "M" && input[i + 1][j - 1] === "S") ||
            (input[i - 1][j + 1] === "S" && input[i + 1][j - 1] === "M"))
        ) {
          count += 1;
        }
      }
    }
  }
  console.log(`Answer, part 2:`, count);
}
