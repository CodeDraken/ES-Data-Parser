const fs = require('fs')

const { jsonToFile } = require('./util/jsonToFile')
const { dataLocation, outputJSON } = require('./config/dataConfig')
const parser = require('./gameParser/index.js')

// grab planets and only keep the ones that have a landscape
const planets = parser(fs.readFileSync(`${dataLocation}/map.txt`, 'utf-8'), 'planet')
  .filter(planet => 'landscape' in planet)

jsonToFile(`${outputJSON}/map/map-planets.json`, planets)
