import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const sequences = _.compact(
    (await fetchInputForDay(9, 2023)).split("\n")
  ).map((line) => line.split(/\s+/).map(Number));

  function seqDiff(sequence) {
    return sequence.slice(1).map((v, i) => v - sequence[i]);
  }

  function interpolateNextElement(sequence) {
    if (sequence.every((x) => x === 0)) return 0;
    return (
      sequence[sequence.length - 1] + interpolateNextElement(seqDiff(sequence))
    );
  }

  function interpolatePrevElement(sequence) {
    if (sequence.every((x) => x === 0)) return 0;
    return sequence[0] - interpolatePrevElement(seqDiff(sequence));
  }

  console.log("Answer, part 1:", _.sum(sequences.map(interpolateNextElement)));
  console.log("Answer, part 2:", _.sum(sequences.map(interpolatePrevElement)));
}
