import fs from 'fs'

(async () => {
  const solutionsDir = `./solutions/${process.argv[2]}`
  const solutionFiles = fs.readdirSync(solutionsDir).sort()
  const tasks = await Promise.all(solutionFiles.map(file => import(`${solutionsDir}/${file}`)))

  const taskNumbers = process.argv.length > 3 ? process.argv.slice(3).map(Number) : Object.keys(tasks).map(i => Number(i) + 1)
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
