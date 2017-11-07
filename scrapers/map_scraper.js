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
data.systemsArrOfStr.forEach(systemStr => {
  systemStr += 'END'
  // get "object" properties / attributes
  let objectAttributes = systemStr.split('object')
  // remove non-object props
  objectAttributes.shift()
  objectAttributes = objectAttributes
      .map(s => s.trim())
      .map(s => s.split('\n'))

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
  sysObj.objects = objectAttributes[0]

  // loop through each line
  lines.forEach(line => {
    // the first word / attribute name, split at the first space
    const attr = line.substr(0, line.indexOf(' '))
    const value = line.substr(line.indexOf(' ') + 1)

    if (value !== 'END') {
      sysObj[attr] = sysObj[attr]
      ? [ ...sysObj[attr], value ]
      : [ value ]
    }
  })
})

// TESTING STUFF //
// "1 Axis"
// console.log(data.systemsArrOfStr[0])
// console.log(data.systems['"1 Axis"'])

// str.substr(0,str.indexOf(' ')); // "72"
// str.substr(str.indexOf(' ')+1); // "tocirah sneab"
