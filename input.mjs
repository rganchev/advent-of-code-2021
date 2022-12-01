import fetch from 'node-fetch'

export async function fetchInputForDay(day, year = 2021) {
  const input = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie: 'session=53616c7465645f5f8a8954a31b17a0392fbb9fdba44b76fe44ad0687903c07d293e70866e863df5d5d398ab3ad56fd95ba61fd886b91dc4effde203c89251581'
    }
  })

  return input.text()
}
