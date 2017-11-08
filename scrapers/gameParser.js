// TODO: try to do this the better way :D
// regex scraper was only suppose to be a test but I got carried away
// https://github.com/endless-sky/endless-sky/blob/master/source/DataFile.cpp

const fs = require('fs')

const { jsonToFile } = require('../util/jsonToFile')
const { dataLocation, outputJSON } = require('../config/dataConfig')

const fileStr = (
  `ship "Tek Far 109"
	sprite "ship/tek far 109"
	attributes
		category "Medium Warship"
		"cost" 18290000
		"shields" 17900
		"hull" 15800
		"automaton" 1
		"mass" 540
		"drag" 9.1
		"heat dissipation" .65
		"fuel capacity" 400
		"cargo space" 31
		"outfit space" 491
		"weapon capacity" 217
		"engine capacity" 98
		"self destruct" .7
		"ramscoop" 3
		weapon
			"blast radius" 280
			"shield damage" 3200
			"hull damage" 1600
			"hit force" 4800
	outfits
		"Korath Detainer"
		"Korath Piercer Launcher" 2
		"Korath Piercer" 62
		"Korath Banisher" 2
		
		"Double Plasma Core"
		"Systems Core (Medium)"
		"Small Heat Shunt" 2
		"Control Transceiver"
		
		"Thruster (Lunar Class)"
		"Steering (Planetary Class)"
		Hyperdrive
	
	engine -9 205
	engine 9 205
	gun 0 -214 "Korath Detainer"
	gun -14 -206 "Korath Piercer Launcher"
	gun 14 -206 "Korath Piercer Launcher"
	turret -89 32
	turret 89 32
	drone 38.5 -115.5 over
	drone 25 -50.5 over
	drone 59 28 over
	drone 28 79 over
	drone 19.5 145.5 over
	drone 57.5 -56.5 under
	drone 40 19 under
	drone 60 58.5 under
	drone 45.5 135 under
	fighter -36.5 -130.5 over
	fighter -61.5 -68 over
	fighter -29.5 -17 over
	fighter -54.5 55 over
	fighter -62 24 under
	fighter -35 136.5 under
	fighter -22 -82 under
	explode "tiny explosion" 70
	explode "small explosion" 40
	explode "medium explosion" 45
	explode "large explosion" 30
	explode "huge explosion" 8
	"final explode" "final explosion medium"
	description "The TF109 is designed almost solely for the purpose of carrying a fleet of Kor Sestor fighters and drones. Without them to serve as a protective screen, the ship itself is relatively helpless."`
)

const spacedAttrVal = (line) => {
  line = line.trim()
  const attr = line.substr(0, line.indexOf(' '))
  const valStr = line.substr(line.indexOf(' ') + 1)
  const value = Number.isNaN(+valStr)
    ? valStr
    : +valStr

  return { attr, value }
}

const parser = (useFileStrHereLater) => {
  const lines = fileStr.split('\n').filter(line => line.length > 0)

  // wrap below for loops in loop through string groups
  const populateObjects = []

  // initialize the first root object
  const typeName = spacedAttrVal(lines[0])
  populateObjects.push({ _type: typeName.attr, _name: typeName.value })

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
      // const chars = line.split('')

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
        // normal attribute
        parent[attr] = attr in parent
          ? Array.isArray(parent[attr])
            ? [...parent[attr], value]
            : [parent[attr], value]
          : value
      } else if (nextIndent > expectedIndent || indent > expectedIndent) {
         // it's a parent node i.e attributes
        if (hasAttr) {
          // some nodes have a value after it i.e sprite "..."
          parent[attr] = { _name: value }
          populateObjects.push(parent[attr])
        } else {
          // just a name i.e "attributes"
          parent[value] = {}
          populateObjects.push(parent[value])
        }
      } else if (indent < expectedIndent || nextIndent < expectedIndent) {
        // go up the node tree
        populateObjects.length = indent
      }
    } catch (err) {
      console.log('ERROR: ', err)
      console.log(`failed at: I ${i}, line: ${lines[i]}`)
    }

    // TODO: char looping or cleanup
    // loop each char of a line
    // for (let j = white; j < chars.length; j++) {
    //   const char = chars[j]

    //   // if it's a comment skip this line
    //   if (char === '#') break
    // }
  }
  return populateObjects
}

console.log(parser())

jsonToFile(`${outputJSON}/test_parser.json`, parser())
