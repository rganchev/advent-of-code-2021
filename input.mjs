import fetch from "node-fetch";
import { existsSync } from "fs";
import { readFile, writeFile, mkdir } from "fs/promises";

export async function fetchInputForDay(day, year = 2021) {
  const dir = `inputs/${year}`;
  const path = `${dir}/${day}.txt`;
  if (existsSync(path)) {
    return readFile(path, "utf-8");
  }

  const input = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie:
        "session=53616c7465645f5f3e8e325df163c2b3852859a59e62143b3fea2f7e741de72dd5f9d0b87502e5896e9f084272daf5522e7c43c00a80a92671a928546552de8f",
    },
  });
  const content = await input.text();

  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(path, content, "utf-8");

  return content;
}
