import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const rocks = _.compact((await fetchInputForDay(14, 2023)).split("\n")).map(
    (row) => row.split("")
  );

  function tilt(arr, [di, dj]) {
    const newArr = arr.map((row) => row.map((x) => (x === "O" ? "." : x)));

    arr.forEach((row, i) =>
      row.forEach((x, j) => {
        if (x !== "O") return;

        let targetI = i + di;
        let targetJ = j + dj;
        let nRocks = 0;
        while (
          0 <= targetI &&
          targetI < arr.length &&
          0 <= targetJ &&
          targetJ < row.length &&
          arr[targetI][targetJ] !== "#"
        ) {
          if (arr[targetI][targetJ] === "O") nRocks += 1;
          targetI += di;
          targetJ += dj;
        }

        if (di) targetI -= di * (nRocks + 1);
        if (dj) targetJ -= dj * (nRocks + 1);

        newArr[targetI][targetJ] = "O";
      })
    );

    return newArr;
  }

  function calcNorthLoad(arr) {
    return _.sum(
      arr.map(
        (row, i) => row.filter((x) => x === "O").length * (arr.length - i)
      )
    );
  }

  function hash(arr) {
    return arr.map((row) => row.join("")).join("");
  }

  function cycle(arr) {
    return tilt(tilt(tilt(tilt(arr, [-1, 0]), [0, -1]), [1, 0]), [0, 1]);
  }

  console.log("Answer, part 1:", calcNorthLoad(tilt(rocks, [-1, 0])));

  const states = [];
  let currentState = rocks;
  let h = hash(currentState);
  while (!states.includes(h)) {
    states.push(h);
    currentState = cycle(currentState);
    h = hash(currentState);
  }

  const loopStart = states.indexOf(h);
  const loopLength = states.length - loopStart;
  const remaining = (1000000000 - loopStart) % loopLength;

  _.times(remaining, () => (currentState = cycle(currentState)));

  console.log("Answer, part 2:", calcNorthLoad(currentState));
}
