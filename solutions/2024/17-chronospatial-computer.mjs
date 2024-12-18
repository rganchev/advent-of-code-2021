import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = await fetchInputForDay(17, 2024);
  const a = Number(/A: (\d+)/.exec(input)[1]);
  const program = /Program: ([\d,]+)/.exec(input)[1].split(",").map(Number);

  function runProgram(initialA) {
    let a = initialA;
    let i = 0;
    const output = [];
    while (a !== 0 && i < program.length) {
      output.push(((a >> ((a & 0b111) ^ 3)) ^ (a & 0b111) ^ 6) & 0b111);
      a >>= 3;
    }
    return output;
  }

  function findMatch() {
    const matches = [];

    function find(prevA, program) {
      const res = program.pop();
      const a = prevA * 8;
      for (let x = 0; x < 8; x += 1) {
        if (((((a + x) >> (x ^ 3)) ^ x ^ 6) & 0b111) === res) {
          if (program.length === 0) {
            matches.push(a + x);
          } else {
            find(a + x, [...program]);
          }
        }
      }
    }

    find(0, program);

    return _.min(matches);
  }

  console.log("Answer, part 1:", runProgram(a).join(","));
  console.log("Answer, part 1:", findMatch());
}
