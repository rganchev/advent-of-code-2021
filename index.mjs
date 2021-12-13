import fs from 'fs'

(async () => {
  const SOLUTIONS_DIR = './solutions'
  const solutionFiles = fs.readdirSync(SOLUTIONS_DIR).sort()
  const tasks = await Promise.all(solutionFiles.map(file => import(`${SOLUTIONS_DIR}/${file}`)))
  
  const taskNumbers = process.argv.length > 2 ? process.argv.slice(2).map(Number) : Object.keys(tasks).map(i => Number(i) + 1)
  for (const number of taskNumbers) {
    console.log(`\nRunning solution for task ${number}`)
    const task = tasks[number - 1]
    if (!task) {
      console.error('No solution found!')
      continue
    }
    await task.solve()
  }
})()
