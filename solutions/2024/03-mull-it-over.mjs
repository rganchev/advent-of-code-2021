import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = (await fetchInputForDay(3, 2024)).trim();

  function executeMuls(str) {
    const regex = /mul\((\d+),(\d+)\)/g;
    let result = 0;
    let match;
    while ((match = regex.exec(str))) {
      result += Number(match[1]) * Number(match[2]);
    }
    return result;
  }

  console.log("Answer, part 1:", executeMuls(input));

  const enabledParts = input.split(/don't\(\)[\s\S]*?do\(\)/);
  console.log("Answer, part 1:", _.sum(enabledParts.map(executeMuls)));
}
