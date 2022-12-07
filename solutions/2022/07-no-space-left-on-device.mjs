import { fetchInputForDay } from '../../input.mjs'
import _ from 'lodash'

export async function solve() {
  const input = _.compact((await fetchInputForDay(7, 2022)).split('\n'))
  const root = { name: '/', isDir: true, parent: null, size: 0, files: [] }

  function executeCommands(input) {
    let cwd = null
    let lineNumber = 0

    const commands = {
      cd(arg, output) {
        if (arg === '/') {
          cwd = root
        } else if (arg === '..') {
          cwd = cwd.parent
        } else {
          const dir = cwd.files.find(f => f.name === arg)
          if (dir) {
            cwd = dir
          } else {
            const newDir = { name: arg, isDir: true, parent: cwd, size: 0, files: [] }
            cwd.files.push(newDir)
            cwd = newDir
          }
        }
      },
      ls(arg, output) {
        cwd.files = output.map(line => {
          const [descriptor, name] = line.split(' ')
          const size = Number.parseInt(descriptor) || 0
          return { name, isDir: descriptor === 'dir', parent: cwd, size, files: [] }
        })
      }
    }

    while (lineNumber < input.length) {
      const line = input[lineNumber]
      lineNumber += 1
      const [, command, arg] = line.split(' ')
      const output = []
      while (lineNumber < input.length && !input[lineNumber].startsWith('$')) {
        output.push(input[lineNumber])
        lineNumber += 1
      }
      commands[command](arg, output)
    }
  }

  function calcDirSizes() {
    function walk(file) {
      if (!file.isDir) {
        let parent = file.parent
        while (parent) {
          parent.size += file.size
          parent = parent.parent
        }
      }

      file.files.forEach(walk)
    }

    walk(root)
  }

  executeCommands(input)
  calcDirSizes()

  function part1() {
    let sum = 0
    function walk(file) {
      if (file.isDir && file.size <= 100000) {
        sum += file.size
      }

      file.files.forEach(walk)
    }

    walk(root)
    return sum
  }

  function part2() {
    const spaceToFree = root.size - 40000000
    let dirToDelete = root
    function walk(file) {
      if (file.isDir && file.size >= spaceToFree && file.size < dirToDelete.size) {
        dirToDelete = file
      }

      file.files.forEach(walk)
    }

    walk(root)
    return dirToDelete.size
  }

  console.log('Answer, part 1:', part1())
  console.log('Answer, part 2:', part2())
}
