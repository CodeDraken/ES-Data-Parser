// grabData - grab predefined data and put into files

const fs = require('fs')

const { jsonToFile } = require('../util/jsonToFile')
const { dataLocation, outputJSON } = require('../config/dataConfig')
const parser = require('../gameParser')

// TODO: this is just for testing, refactor it later

// files by species
const humanFiles = {
  ship: [ 'ships', 'marauders', 'kestrel' ],
  mission: [ 'jobs' ],
  fleet: [ 'fleets' ],
  outfit: [ 'engines', 'outfits', 'power', 'weapons' ]
}

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
        const dataFile = fs.readFileSync(`${dataLocation}${file}.txt`, 'utf-8')
        const dataObj = parser(dataFile, dataType, file)

        jsonToFile(`${outputJSON}/name/${file}.json`, dataObj)
      } catch (err) {
        console.log(err)
        continue
      }
    }
  }
}

parseSpecies('human', humanFiles)

// parse file, data${_path}, fileName. what to grab
// const grab = (_path, name, search) => {
//   parser(fs.readFileSync(`${dataLocation}${_path}.txt`, 'utf-8'), search, _path)
// }

// grab('/map', 'map-planets', 'planet')
// grab('/map', 'map-systems', 'system')
// grab('/governments', 'governments', 'government')
// grab('/sales', 'sales', 'outfitter')
// grab('/outfits/outfits', 'outfits-human', 'outfit')
// grab('/ships/humans', 'ships-human', 'ship')
// grab('/fleets/fleets', 'fleets', 'fleet')
// grab('/mix/drak', 'drak-ship', 'ship')
