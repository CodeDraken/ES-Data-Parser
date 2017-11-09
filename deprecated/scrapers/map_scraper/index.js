const fs = require('fs')

const genSystemObjects = require('./genSystemObjects')
const { systemRegex } = require('../../config/regexConfig')
const dataConfig = require('../../config/dataConfig')

const mapData = {
  // string from inital read file
  mapStr: '',
  // split into system strings
  systemsArrOfStr: [],
  // convert each system string to an object
  systems: []
}

const openMap = (mapFile = `${dataConfig.dataLocation}/map.txt`, call) => {
  const mapStr = fs.readFileSync(mapFile, 'utf-8')

  console.log('[mapScraper]: Map loaded')

  return mapStr
}

const scrapeSystems = (mapStr = mapData.mapStr) => {
  // split each system ( at each empty line between them )
  mapData.systemsArrOfStr = mapData.mapStr.match(systemRegex)

  // arr of str to system objects
  mapData.systems = genSystemObjects(mapData.systemsArrOfStr)
}

// load in the text file as is
mapData.mapStr = openMap()

// TESTING STUFF //
// scrapeSystems()
// "1 Axis"
// console.log(data.systemsArrOfStr[0])
// console.log(data.systems['"1 Axis"'])
// console.log(data.systems)

module.exports = {
  mapData,
  scrapeSystems
}
