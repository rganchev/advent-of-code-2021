import fs from "fs";
import _ from "lodash";
import fetch from "node-fetch";

(async () => {
  const today = new Date();
  const year = process.argv[2] ? Number(process.argv[2]) : today.getFullYear();
  const day = process.argv[3] ? Number(process.argv[3]) : today.getDate();
  const input = await fetch(`https://adventofcode.com/${year}/day/${day}`);

  const text = await input.text();
  const match = /--- Day \d+: (.*) ---/.exec(text);
  const fileName = _.kebabCase(`${day}-${match[1]}`);
  const path = `solutions/${year}/${fileName}.mjs`;
  if (fs.existsSync(path)) {
    console.error(`File ${path} already exists!`);
  } else {
    const templateString = fs.readFileSync("template.mjs", "utf-8");
    const content = templateString.replace("$day", day).replace("$year", year);
    fs.writeFileSync(path, content, "utf-8");
    console.info(`Created ${path}!`);
  }
})();
