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

const addNode = (attr, value, parent, hasAttr, tree) => {
  // it's a parent node i.e attributes
  if (hasAttr) {
    console.log('add attribute node: ', attr, value)
    const node = { _value: value }
    // some nodes have a value after it i.e sprite "..."
    // can be an array of nodes
    parent[attr] = attr in parent
    ? Array.isArray(parent[attr])
      ? [ ...parent[attr], node ]
      : [ parent[attr], node ]
    : node

    tree.push(node)
  } else {
    const node = {}
    console.log('add plain node: ', attr, value)
    // just a name i.e "attributes"

    parent[value] = value in parent
    ? Array.isArray(parent[value])
      ? [ ...parent[value], node ]
      : [ parent[value], node ]
    : node

    tree.push(node)
  }
}

const parser = (fileStr, groupsToGrab, _path) => {
  const debug = false

  const blocks = fileStr
    .match(genericGroupRegex(groupsToGrab))
    .filter(block => block.length > 0)

  console.log(genericGroupRegex(groupsToGrab))
  console.log(`Found ${blocks.length} matches for ${groupsToGrab} in ${_path}`)

  return blocks.map((block, i) => {
    const lines = block
      .split('\n')
      .filter(line => line.length > 0)
    const tree = []

    // initialize the first root object
    const typeName = spacedAttrVal(lines[0])
    tree.push({ _type: typeName.attr, _value: typeName.value })

    // use for loop so we can skip lines when needed
    for (let i = 1; i < lines.length; i++) {
      try {
        // the parent node
        const parent = tree[tree.length - 1]
        // how many nodes deep we are
        const expectedIndent = tree.length

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
          : indent

        // get the attribute name and value
        const { attr, value } = spacedAttrVal(line)
        const hasAttr = !!attr

        if (indent === expectedIndent && nextIndent === expectedIndent) {
          addAttr(attr, value, parent, hasAttr)
        } else if (nextIndent > expectedIndent || indent > expectedIndent) {
          addNode(attr, value, parent, hasAttr, tree)
        } else if (indent === expectedIndent && nextIndent < expectedIndent) {
          // add then go up tree
          addAttr(attr, value, parent, hasAttr)

          tree.length = nextIndent
        } else if (indent < expectedIndent) {
          // go up the node tree
          tree.length = indent
          // get the right parent and add to it
          const newParent = tree[tree.length - 1]
          addAttr(attr, value, newParent, hasAttr)
        }
      } catch (err) {
        console.log('ERROR: ', err)
        console.log(`failed at: I ${i}, line: ${lines[i]}`)
      }
    }
    return tree[0]
  })
}

// testing
// console.log(parser())

// parse file
const test = (_path, name, search) => {
  jsonToFile(
    `${outputJSON}/parserJSON/${name}.json`,
    parser(fs.readFileSync(`${dataLocation}${_path}.txt`, 'utf-8'), search, _path)
  )
}

test('/map', 'map-planets', 'planet')
test('/map', 'map-systems', 'system')
test('/governments', 'governments', 'government')
test('/sales', 'sales', 'outfitter')
test('/outfits/outfits', 'outfits-human', 'outfit')
test('/ships/humans', 'ships-human', 'ship')
test('/fleets/fleets', 'fleets', 'fleet')
test('/mix/drak', 'drak-ship', 'ship')
