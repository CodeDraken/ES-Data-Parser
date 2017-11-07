const { systemObjectsRegex } = require('../../config/regexConfig')

const prepInitialString = (str) => {
  let preppedStr = str
  preppedStr += '{!END!}'

  return preppedStr
}

// convert object attribute arrays to objects
const convertObjAttr = objectPropArr => {
  return objectPropArr.map(objArr => objArr.reduce((object, attr) => {
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
}

const grabObjectAttributes = systemStr => {
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
  const arrOfObjectAttributes = convertObjAttr(objectPropArr)

  return arrOfObjectAttributes
}

const grabAttributes = (systemStrLines, sysObj) => {
  // loop through each line creating an array of values for each attribute key
  systemStrLines.forEach(line => {
    // attribute name, split at the first space, and values after
    const attr = line.substr(0, line.indexOf(' '))
    const value = line.substr(line.indexOf(' ') + 1)

    if (value !== '{!END!}') {
      sysObj[attr] = sysObj[attr]
        ? [ ...sysObj[attr], value ]
        : [ value ]
    }
  })
}

const genSystemObjects = (arrOfSystemStrings) => {
  const systems = {}

  // read system strings & convert into objects
  arrOfSystemStrings.forEach((systemStr, i) => {
    let preppedSystemStr = prepInitialString(systemStr)

    // grab the "object" attributes before removing them from string
    const objectAttributes = grabObjectAttributes(preppedSystemStr)

    // remove all "object" attributes
    const systemStrNoObj = preppedSystemStr.replace(systemObjectsRegex, '')

    // split into lines & remove extra whitespace
    const systemStrLines = systemStrNoObj
      .split('\n')
      .map(str => str.trim())

    // remove extra new line ( empty el in array )
    systemStrLines.pop()

    // index 0 should be the system name so use that
    const systemName = systemStrLines[0].replace('system ', '')

    // initialize the system obj
    systems[systemName] = {}
    // shorter variable reference to it
    const sysObj = systems[systemName]

    // add the "object" propeties that we pulled out above ^
    sysObj.objects = objectAttributes

    grabAttributes(systemStrLines, sysObj)
  })

  return systems
}

module.exports = genSystemObjects
