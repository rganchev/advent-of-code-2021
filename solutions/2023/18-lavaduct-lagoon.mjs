import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

const directions = {
  R: [0, 1],
  D: [1, 0],
  U: [-1, 0],
  L: [0, -1],
};

export async function solve() {
  const input = _.compact((await fetchInputForDay(18, 2023)).split("\n")).map(
    (line) => line.match(/^(\w) (\d+) \(#(\w+)\)$/).slice(1)
  );

  function calcArea(instructions) {
    const points = [{ i: 0, j: 0 }];
    instructions.forEach(([dir, steps], i) =>
      points.push({
        i: points[i].i + directions[dir][0] * steps,
        j: points[i].j + directions[dir][1] * steps,
      })
    );

    const lines = points
      .slice(1)
      .map((point, index) => ({ start: points[index], end: point }));
    let horizontalLines = lines.filter((line) => line.start.i === line.end.i);
    horizontalLines.forEach((line) => {
      const a = line.start.j;
      const b = line.end.j;
      line.start.j = Math.min(a, b);
      line.end.j = Math.max(a, b);
    });
    horizontalLines.sort(
      (a, b) => a.start.i - b.start.i || a.start.j - b.start.j
    );

    let area = 0;
    while (horizontalLines.length > 0) {
      const minI = horizontalLines[0].start.i;
      const nextI = horizontalLines.find((l) => l.start.i !== minI).start.i;
      const height = nextI - minI;
      horizontalLines
        .filter((line) => line.start.i === minI)
        .forEach((line) => {
          const len = line.end.j - line.start.j + 1;
          area += len * height;
          const nextLevelLines = horizontalLines.filter(
            (l) => l.start.i === nextI
          );
          for (const otherLine of nextLevelLines) {
            const minStart = Math.min(line.start.j, otherLine.start.j);
            const maxStart = Math.max(line.start.j, otherLine.start.j);
            const minEnd = Math.min(line.end.j, otherLine.end.j);
            const maxEnd = Math.max(line.end.j, otherLine.end.j);
            if (maxStart === minEnd) {
              line.start.j = minStart;
              line.end.j = maxEnd;
              // mark for deletion
              otherLine.start = otherLine.end = { i: 0, j: 0 };
            } else if (maxStart < minEnd) {
              area +=
                minEnd -
                maxStart +
                1 -
                (minStart < maxStart) -
                (minEnd < maxEnd);
              otherLine.start.j = minStart;
              otherLine.end.j = maxStart;
              line.start.j = minEnd;
              line.end.j = maxEnd;
              if (line.start.j === line.end.j) break;
            }
          }

          line.start.i = line.end.i = nextI;
        });

      horizontalLines = horizontalLines.filter(
        (line) => line.end.j !== line.start.j
      );
    }

    return area;
  }

  console.log("Answer, part 1:", calcArea(input));

  const part2Instructions = input.map(([, , color]) => [
    "RDLU"[color.slice(-1)],
    Number.parseInt(color.slice(0, -1), 16),
  ]);
  console.log("Answer, part 2:", calcArea(part2Instructions));
}
