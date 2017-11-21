// grabData - grab predefined data and put into files

const fs = require('fs')

const { jsonToFile } = require('../util/jsonToFile')
const { dataLocation, outputJSON } = require('../config/dataConfig')
const parser = require('../gameParser')

// TODO: this is just for testing, refactor it later
// files by species

// humans are special
const humanFiles = {
  ship: [ 'ships', 'marauders', 'kestrel' ],
  mission: [ 'jobs' ],
  fleet: [ 'fleets' ],
  outfit: [ 'engines', 'outfits', 'power', 'weapons' ]
}

// species
const species = [ 'coalition', 'drak', 'hai', 'korath', 'indigenous', 'pug', 'remnant', 'wanderer' ]

const assumeGenericSpecies = name => {
  return {
    ship: [ `${name} ships` ],
    mission: [ `${name} missions`, `${name} jobs` ],
    fleet: [ name ],
    outfit: [ `${name} outfits`, `${name} weapons` ]
  }
}

const parseSpecies = (name, filesObj) => {
  if (!filesObj) {
    filesObj = assumeGenericSpecies(name)
  }

  for (let dataType in filesObj) {
    for (let file of filesObj[dataType]) {
      try {
        const dataFile = fs.readFileSync(`${dataLocation}/${file}.txt`, 'utf-8')
        const dataObj = parser(dataFile, dataType, file)

        jsonToFile(`${outputJSON}/${name}/${file}.json`, dataObj)
      } catch (err) {
        console.log(`${file} not found trying the main file ${name}`)
        // try main file
        const dataFile = fs.readFileSync(`${dataLocation}/${name}.txt`, 'utf-8')
        const dataObj = parser(dataFile, dataType, name)

        jsonToFile(`${outputJSON}/${name}/${file}.json`, dataObj)
      }
    }
  }
}

const parseAllSpecies = () => {
  parseSpecies('human', humanFiles)

  species.forEach(spec => {
    parseSpecies(spec)
  })

  console.log('All species finished parsing!')
}

// parseAllSpecies()

// files with fleets in them
const fleetFiles = ['fleets', 'coalition', 'hai', 'korath', 'remnant', 'wanderers', 'indigenous']

// parse a fleet file
const parseFleet = (fileName) => {
  try {
    const dataFile = fs.readFileSync(`${dataLocation}/${fileName}.txt`, 'utf-8')
    const dataObj = parser(dataFile, 'fleet', fileName)

    return dataObj
  } catch (err) {
    console.log(err)
  }
}

// parse all files with fleets in them
const parseAllFleets = () => {
  let superFleets = []

  fleetFiles.forEach(fleetFile => {
    superFleets = [...superFleets, ...parseFleet(fleetFile)]
  })

  console.log('All fleets finished parsing!')
  jsonToFile(`${outputJSON}/util/super-fleets.json`, superFleets)
}

module.exports = {
  parseAllSpecies,
  parseAllFleets
}

// if no custom object passed in
// read data dir
// filter names => nameRegex.test(fileName)
// look for everything
// output json with same file name
// or try new regex
