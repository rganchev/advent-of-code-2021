import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const components = {};
  _.compact((await fetchInputForDay(25, 2023)).split("\n"))
    .map((line) => line.split(/:\s+/))
    .forEach(([from, to]) => (components[from] = to.split(" ")));

  const edges = Object.entries(components).flatMap(([k, v]) =>
    v.map((cmp) => [k, cmp].sort().join(":"))
  );

  Object.keys(components).forEach((cmp) => {
    components[cmp].forEach((other) => {
      components[other] = components[other] || [];
      components[other].push(cmp);
    });
  });

  const counts = Object.fromEntries(edges.map((k) => [k, 0]));
  Object.keys(components).forEach((start) => {
    const paths = { [start]: [start] };
    const q = [start];
    while (q.length > 0) {
      const current = q.shift();
      components[current]
        .filter((cmp) => !paths[cmp])
        .forEach((cmp) => {
          paths[cmp] = [...paths[current], cmp];
          q.push(cmp);
        });
    }
    const longestPath = _.max(Object.values(paths).map((p) => p.length));
    Object.values(paths).forEach((path) => {
      if (path.length === longestPath) {
        path.slice(1).forEach((cmp, i) => (counts[[cmp, path[i]].sort().join(":")] += 1));
      }
    });
  });

  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([edge]) => {
      const [a, b] = edge.split(":");
      components[a] = components[a].filter((x) => x !== b);
      components[b] = components[b].filter((x) => x !== a);
    });

  function countConnectedComponent(components, start) {
    const q = [start];
    const cc = new Set();
    while (q.length > 0) {
      const current = q.shift();
      cc.add(current);
      components[current].filter((cmp) => !cc.has(cmp)).forEach((cmp) => q.push(cmp));
    }
    return cc.size;
  }

  const connectedComponent = countConnectedComponent(components, Object.keys(components)[0]);
  console.log(connectedComponent * (Object.keys(components).length - connectedComponent));
}
