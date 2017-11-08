// TODO: try to do this the better way :D
// regex scraper was only suppose to be a test but I got carried away
// https://github.com/endless-sky/endless-sky/blob/master/source/DataFile.cpp
const fs = require('fs')

const { dataLocation, outputJSON } = require('../config/dataConfig')

const parser = (useFileStrHereLater) => {
  const fileStr = fs.readFileSync(`${dataLocation}/map.txt`, 'utf-8')
  const lines = fileStr.split('\n')

  // use for loop so we can skip lines when needed
  for (let i = 0; i < lines.length; i++) {
    // list of objects we are currently populating
    const populateObjects = []
    const line = lines[i]
    const nextLine = lines[i + 1]
    const chars = line.split('')

    // skip empty lines
    if (line === '\n' || line.trim().length < 1) continue

    // number of white space / indents for the line
    let white = line.search(/\S|$/)
    // if next white is > white assume it's an object
    let nextWhite = nextLine.search(/\S|$/)

    // 0 indents = start of block

    // loop each char of a line
    for (let j = white; j < chars.length; j++) {
      const char = chars[j]

      // if it's a comment skip this line
      if (char === '#') break
    }
  }
}
