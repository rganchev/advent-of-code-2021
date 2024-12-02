import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(8, 2023)).split("\n"));
  const directions = input.shift();
  let map = input.reduce((m, line) => {
    const [, root, left, right] = /^(\w{3}) = \((\w{3}), (\w{3})\)$/.exec(line);
    m[root] = { left, right };
    return m;
  }, {});

  function countSteps(startNode, condition) {
    let step = 0;
    let current = startNode;
    while (!condition(current, step)) {
      const dir =
        directions[step % directions.length] === "L" ? "left" : "right";
      current = map[current][dir];
      step += 1;
    }
    return step;
  }

  console.log(
    "Answer, part 1:",
    countSteps("AAA", (node) => node === "ZZZ")
  );

  function gcd(a, b) {
    let r0 = a;
    let r1 = b;

    while (r1 > 0) {
      const prev = r1;
      r1 = r0 % r1;
      r0 = prev;
    }

    return r0;
  }

  function lcm(numbers) {
    const bigInts = numbers.map(BigInt);
    const product = bigInts.reduce((a, b) => a * b, 1n);
    const greatestCommonDivisor = bigInts.reduce(
      (prev, num) => gcd(prev, product / BigInt(num)),
      product
    );
    return Number(product / greatestCommonDivisor);
  }

  const startNodes = Object.keys(map).filter((k) => k.endsWith("A"));
  const zOffsets = startNodes.map((start) =>
    countSteps(start, (node) => node.endsWith("Z"))
  );
  console.log("Answer, part 2:", lcm(zOffsets));
}
