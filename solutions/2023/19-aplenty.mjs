import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const [rulesInput, partsInput] = (await fetchInputForDay(19, 2023)).split(
    "\n\n"
  );
  const workflows = _.fromPairs(
    rulesInput.split("\n").map((line) => {
      const [, name, rulesString] = line.match(/^(\w+)\{(.+)\}$/);
      const rules = rulesString.split(",").map((ruleString) => {
        const match = ruleString.match(/^([xmas])([<>])(\d+):(\w+)$/);
        if (match) {
          const [, category, operator, value, destination] = match;
          return { category, operator, value: Number(value), destination };
        }
        return { destination: ruleString };
      });
      return [name, rules];
    })
  );

  const parts = _.compact(partsInput.split("\n")).map((line) =>
    eval(`(${line.replace(/=/g, ":")})`)
  );

  function process(part) {
    let destination = "in";
    while (destination !== "A" && destination !== "R") {
      destination = workflows[destination].find(
        (rule) =>
          !rule.category ||
          eval(`${part[rule.category]} ${rule.operator} ${rule.value}`)
      ).destination;
    }

    return destination === "A";
  }

  const acceptedParts = parts.filter(process);
  console.log(
    "Answer, part 1:",
    _.sum(acceptedParts.flatMap((p) => [p.x, p.m, p.a, p.s]))
  );

  const acceptingRuleSets = [];
  function traverseStates(from, rules) {
    if (from === "R") return;
    if (from === "A") {
      acceptingRuleSets.push(rules);
      return;
    }

    const workflow = workflows[from];
    workflow.forEach((rule, index) => {
      traverseStates(rule.destination, [
        ...rules,
        ...workflow.slice(0, index).map((r) => ({
          category: r.category,
          operator: r.operator === "<" ? ">=" : "<=",
          value: r.value,
        })),
        ...(rule.category
          ? [_.pick(rule, "category", "operator", "value")]
          : []),
      ]);
    });
  }

  traverseStates("in", []);

  console.log(
    "Answer, part 2:",
    _.sum(
      acceptingRuleSets.map((ruleSet) => {
        const ranges = ["x", "m", "a", "s"].map((category) => [
          _.max([
            1,
            ...ruleSet
              .filter(
                (r) => r.category === category && r.operator.startsWith(">")
              )
              .map((r) => (r.operator === ">" ? r.value + 1 : r.value)),
          ]),
          _.min([
            4000,
            ...ruleSet
              .filter(
                (r) => r.category === category && r.operator.startsWith("<")
              )
              .map((r) => (r.operator === "<" ? r.value - 1 : r.value)),
          ]),
        ]);
        return ranges.reduce(
          (product, range) => product * (range[1] - range[0] + 1),
          1
        );
      })
    )
  );
}
