const fs = require('fs')

const { systemRegex, systemObjectsRegex } = require('../config/regexConfig')
const dataConfig = require('../config/dataConfig')

const data = {
  // string from inital read file
  systemsStrings: '',
  // split into system strings
  systemsArrOfStr: [],
  // convert each system string to an object
  systems: {}
}

const openMap = (mapFile = `${dataConfig.dataLocation}/map.txt`) => {
  return fs.readFileSync(mapFile, 'utf-8')
}

// load in the text file as is
data.systemsStrings = openMap()

// split each system ( at each empty line between them )
data.systemsArrOfStr = data.systemsStrings.match(systemRegex)

// read system strings & convert into objects
data.systemsArrOfStr.forEach((systemStr, i) => {
  systemStr += '{!END!}'
  // TODO: some object props have names after them
  // get "object" properties / attributes
  let objectAttributes = systemStr.split('object')
  // remove non-object props
  objectAttributes.shift()

    // array of arrays for object values
  const objectPropArr = objectAttributes
      .map(objStr => objStr
        .replace(/\t/g, '')
        .split('\n')
        .filter(attr => attr.length > 0 && attr !== '{!END!}')
    )

    // array of arrays to array of objects
  const arrOfObjectAttributes = objectPropArr.map(objArr => objArr.reduce((object, attr) => {
      // if first char is a space then it is a named object
    const isNamedObj = attr.charAt(0) === ' '
    if (isNamedObj) {
      object.name = attr.trim()
    } else {
        // attr name and value
      const nameVal = attr.split(' ')
      object[nameVal[0]] = nameVal[1]
    }
    return object
  }, { name: null }
  ))

  // remove all "object" properties
  const systemStrStripped = systemStr.replace(systemObjectsRegex, '')

  // split into lines & remove extra whitespace
  const lines = systemStrStripped.split('\n').map(str => str.trim())
  // remove extra new line ( empty el in array )
  lines.pop()

  // index 0 should be the system name so use that
  const systemName = lines[0].replace('system ', '')
  // initialize the system obj
  data.systems[systemName] = {}
  const sysObj = data.systems[systemName]

  // add the "object" propeties that we pulled out above ^
  sysObj.objects = arrOfObjectAttributes

  // loop through each line
  lines.forEach(line => {
    // the first word / attribute name, split at the first space
    const attr = line.substr(0, line.indexOf(' '))
    const value = line.substr(line.indexOf(' ') + 1)

    if (value !== '{!END!}') {
      sysObj[attr] = sysObj[attr]
      ? [ ...sysObj[attr], value ]
      : [ value ]
    }
  })
})

// TESTING STUFF //
// "1 Axis"
console.log(data.systemsArrOfStr[0])
console.log(data.systems['"1 Axis"'])

// str.substr(0,str.indexOf(' ')); // "72"
// str.substr(str.indexOf(' ')+1); // "tocirah sneab"
