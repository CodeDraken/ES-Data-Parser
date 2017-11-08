// gameParser - a data parser similar to the game.
// First step to cleaning up all these scrapers

const fs = require('fs')

const { jsonToFile } = require('../util/jsonToFile')
const { dataLocation, outputJSON } = require('../config/dataConfig')
const { genericGroupRegex } = require('../config/regexConfig')

const firstNonQuotedSpace = (str) => {
  str = str.trim()
  const strArr = str
  let quoteBalance = 0

  // no quotes
  if (!/"/g.test(str)) return str.indexOf(' ')

  for (let i = 0; i < strArr.length; i++) {
    const char = str[i]

    if (char === '"') quoteBalance++

    if (char === ' ' && quoteBalance % 2 === 0) return i
  }

  return -1
}

const spacedAttrVal = (line) => {
  line = line.trim()
  const firstSpace = firstNonQuotedSpace(line)
  // line.indexOf(' ')
  const attr = line.substr(0, firstSpace)
  const valStr = line.substr(firstSpace + 1)
  const value = Number.isNaN(+valStr)
    ? valStr
    : +valStr

  return { attr, value }
}

const addAttr = (attr, value, parent, hasAttr) => {
  if (hasAttr) {
    // normal attribute
    parent[attr] = attr in parent
    ? Array.isArray(parent[attr])
      ? [ ...parent[attr], value ]
      : [ parent[attr], value ]
    : value
  } else {
    // probably a single attribute no value i.e outfits like "blaster" ( no # after )
    parent.singles = parent.singles
      ? [ ...parent.singles, value ]
      : [ value ]
  }
}

const parser = (fileStr, groupsToGrab) => {
  console.log(genericGroupRegex(groupsToGrab))
  const blocks = fileStr
    .match(genericGroupRegex(groupsToGrab))
    .filter(block => block.length > 0)

  console.log(`Found ${blocks.length} matches for ${groupsToGrab}`)

  return blocks.map(block => {
    const lines = block
      .split('\n')
      .filter(line => line.length > 0)
    const populateObjects = []

    // initialize the first root object
    const typeName = spacedAttrVal(lines[0])
    populateObjects.push({ _type: typeName.attr, _value: typeName.value })

    // use for loop so we can skip lines when needed
    for (let i = 1; i < lines.length; i++) {
      try {
        // the parent node
        const parent = populateObjects[populateObjects.length - 1]
        // how many nodes deep we are
        const expectedIndent = populateObjects.length

        // list of objects we are currently populating
        const line = lines[i]
        const nextLine = lines[i + 1]

        // skip empty lines
        if (line === '\n' || line.trim().length < 1) continue

        // number of white space / indents for the line
        const indent = line.search(/\S|$/)
       // if next white is > white assume it's an object
        const nextIndent = nextLine
          ? nextLine.search(/\S|$/)
          : true

        // get the attribute name and value
        const { attr, value } = spacedAttrVal(line)
        const hasAttr = !!attr

        if (indent === expectedIndent && nextIndent === expectedIndent) {
          addAttr(attr, value, parent, hasAttr)
        } else if (nextIndent > expectedIndent || indent > expectedIndent) {
           // it's a parent node i.e attributes
          if (hasAttr) {
            // some nodes have a value after it i.e sprite "..."
            parent[attr] = { _value: value }
            populateObjects.push(parent[attr])
          } else {
            // just a name i.e "attributes"
            parent[value] = {}
            populateObjects.push(parent[value])
          }
        } else if (indent === expectedIndent || nextIndent < expectedIndent) {
          // add then go up tree
          addAttr(attr, value, parent, hasAttr)

          populateObjects.length = nextIndent
        } else if (indent < expectedIndent) {
          // go up the node tree
          populateObjects.length = indent
        }
      } catch (err) {
        console.log('ERROR: ', err)
        console.log(`failed at: I ${i}, line: ${lines[i]}`)
      }
    }
    return populateObjects[0]
  })
}

// testing
// console.log(parser())

// parse every file
const test = (_path, name, search) => {
  jsonToFile(
    `${outputJSON}/parserJSON/${name}.json`,
    parser(fs.readFileSync(`${dataLocation}${_path}.txt`, 'utf-8'), search)
  )
}

test('/map', 'map-planets', 'planet')
test('/map', 'map-systems', 'system')
test('/governments', 'governments', 'government')
test('/sales', 'sales', 'outfitter')
test('/fleets/fleets', 'fleets', 'fleet')
test('/mix/drak', 'drak-ship', 'ship')

// const testFile = fs.readFileSync(`${dataLocation}/map.txt`, 'utf-8')

// jsonToFile(`${outputJSON}/test_parser.json`, parser(testFile, 'planet'))
