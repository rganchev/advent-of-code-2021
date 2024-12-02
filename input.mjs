import fetch from "node-fetch";

export async function fetchInputForDay(day, year = 2021) {
  const input = await fetch(
    `https://adventofcode.com/${year}/day/${day}/input`,
    {
      headers: {
        Cookie:
          "session=53616c7465645f5f124c2ad20e0a789bd4a1c1b1b8be136dcfc3bb134872763fc6cf3115e73ccadfdc775ded1834d0f8525fa09bc7c0e5d8297e737de64543b1",
      },
    }
  );

  return input.text();
}
