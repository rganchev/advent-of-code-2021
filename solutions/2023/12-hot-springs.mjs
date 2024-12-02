import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const records = _.compact((await fetchInputForDay(12, 2023)).split("\n"))
    .map((row) => row.split(" "))
    .map(([mask, groups]) => [mask, groups.split(",").map(Number)]);

  function countOccurrences(string, symbol) {
    let total = 0;
    for (const s of string) {
      if (s === symbol) total += 1;
    }
    return total;
  }

  function countMatches(fullMask, allGroupSizes) {
    const cache = new Map();

    function count(maskOffset, groupsOffset) {
      const cacheKey = `${maskOffset},${groupsOffset}`;
      if (cache.has(cacheKey)) return cache.get(cacheKey);

      const mask = fullMask.slice(maskOffset);
      const groupSizes = allGroupSizes.slice(groupsOffset);

      const totalDiezes = _.sum(groupSizes);
      if (totalDiezes < countOccurrences(mask, "#")) return 0;
      if (groupSizes.length === 0) return 1;

      const minGroupsLength = totalDiezes + groupSizes.length - 1;
      let sum = 0;
      const firstDiezIndex = mask.indexOf("#");
      for (
        let offset = 0;
        offset <=
        Math.min(
          mask.length - minGroupsLength,
          firstDiezIndex >= 0 ? firstDiezIndex : Infinity
        );
        offset += 1
      ) {
        let isValid = true;
        for (let i = 0; i < offset && isValid; i += 1) {
          if (mask[i] === "#") isValid = false;
        }
        for (let i = offset; i < offset + groupSizes[0] && isValid; i += 1) {
          if (mask[i] === ".") isValid = false;
        }
        if (groupSizes.length > 1 && mask[offset + groupSizes[0]] === "#") {
          isValid = false;
        }

        if (isValid) {
          let sliceOffset = offset + groupSizes[0];
          if (groupSizes.length > 1) sliceOffset += 1;

          sum += count(maskOffset + sliceOffset, groupsOffset + 1);
        }
      }

      cache.set(cacheKey, sum);
      return sum;
    }

    return count(0, 0);
  }

  console.log(
    "Answer, part 1:",
    _.sum(
      records.map(([mask, groupLengths]) => countMatches(mask, groupLengths))
    )
  );

  const unfoldedRecords = records.map(([mask, groups]) => [
    new Array(5).fill(mask).join("?"),
    new Array(5).fill(0).flatMap(() => groups),
  ]);
  console.log(
    "Answer, part 2:",
    _.sum(
      unfoldedRecords.map(([mask, groupLengths], i) =>
        countMatches(mask, groupLengths)
      )
    )
  );
}
