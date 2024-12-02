import { fetchInputForDay } from "../../input.mjs";
import _ from "lodash";

export async function solve() {
  const input = _.compact((await fetchInputForDay(20, 2023)).split("\n")).map(
    (line) => [...line.match(/^([%&]?)(\w+) -> ([\w\s,]+)$/)].slice(1)
  );
  const modules = {};
  input.forEach(([type, name, connections]) => {
    modules[name] = {
      name,
      type,
      connections: connections.split(", "),
    };
  });
  modules.rx = { name: "rx", type: "rx", connections: [] };

  Object.values(modules).forEach((module) => {
    module.connections = module.connections.map((n) => modules[n]);
  });

  Object.values(modules).forEach((module) => {
    if (module.type === "%") {
      module.isOn = false;
    } else if (module.type === "&") {
      module.inputs = _.fromPairs(
        Object.keys(modules)
          .filter((name) => modules[name].connections.includes(module))
          .map((name) => [name, "low"])
      );
    }
  });

  function pushButton() {
    const q = [["button", "low", modules.broadcaster]];
    let lowPulses = 0;
    let highPulses = 0;
    while (q.length > 0) {
      const [source, pulse, module] = q.shift();

      if (pulse === "low") lowPulses += 1;
      else highPulses += 1;

      if (module.name === "broadcaster") {
        module.connections.forEach((con) => {
          q.push([module.name, pulse, con]);
        });
      } else if (module.type === "%" && pulse === "low") {
        module.connections.forEach((con) => {
          q.push([module.name, module.isOn ? "low" : "high", con]);
        });
        module.isOn = !module.isOn;
      } else if (module.type === "&") {
        module.inputs[source] = pulse;
        const outputPulse = Object.values(module.inputs).every(
          (v) => v === "high"
        )
          ? "low"
          : "high";
        module.connections.forEach((con) => {
          q.push([module.name, outputPulse, con]);
        });
      }
    }

    return [lowPulses, highPulses];
  }

  function resetModules() {
    Object.values(modules).forEach((module) => {
      if (module.type === "%") module.isOn = false;
      if (module.type === "&")
        Object.keys(module.inputs).forEach(
          (inp) => (module.inputs[inp] = "low")
        );
    });
  }

  const [lowPulses, highPulses] = _.times(1000, pushButton).reduce(
    (sums, [lowPulses, highPulses]) => {
      sums[0] += lowPulses;
      sums[1] += highPulses;
      return sums;
    },
    [0, 0]
  );

  console.log("Answer, part 1:", lowPulses * highPulses);

  resetModules();

  let count = 0;
  const cycleLengths = {};
  modules.cs.inputs = new Proxy(modules.cs.inputs, {
    set(target, prop, value, receiver) {
      if (value === "high" && !cycleLengths[prop]) {
        cycleLengths[prop] = count;
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });

  while (
    Object.keys(cycleLengths).length < Object.keys(modules.cs.inputs).length
  ) {
    count += 1;
    pushButton();
  }

  console.log(
    "Answer, part 2:",
    Object.values(cycleLengths).reduce((p, x) => p * x, 1)
  );
}
