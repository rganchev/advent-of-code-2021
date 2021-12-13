import fetch from 'node-fetch'

export async function fetchInputForDay(day) {
  const input = await fetch(`https://adventofcode.com/2021/day/${day}/input`, {
    headers: {
      Cookie: 'session=<insert-session-token-here>'
    }
  })

  return input.text()
}
