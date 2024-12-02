import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const initSequence = (await fetchInputForDay(15, 2023)).trim().split(",");

  function hash(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i += 1) {
      sum += str.charCodeAt(i);
      sum *= 17;
      sum %= 256;
    }
    return sum;
  }

  console.log("Answer, part 1:", _.sum(initSequence.map(hash)));

  const boxes = _.times(256, () => []);

  function processInstruction(instruction) {
    const label = instruction.match(/^(\w+)/)[1];
    const box = boxes[hash(label)];
    const lensIndex = box.findIndex((l) => l[0] === label);

    if (instruction.includes("=")) {
      const focalLength = Number(instruction.split("=")[1]);
      if (lensIndex >= 0) {
        box[lensIndex][1] = focalLength;
      } else {
        box.push([label, focalLength]);
      }
    } else if (lensIndex >= 0) {
      box.splice(lensIndex, 1);
    }
  }
  initSequence.forEach(processInstruction);
  console.log(
    "Answer, part 2:",
    _.sum(
      boxes.flatMap((box, i) =>
        box.map((lens, j) => (i + 1) * (j + 1) * lens[1])
      )
    )
  );
}
