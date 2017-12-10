const fs = require('fs')

const { jsonToFile } = require('./util/jsonToFile')
const { dataLocation, outputJSON } = require('./config/dataConfig')
const parser = require('./gameParser/index.js')

// TODO: code here is just for quick testing - needs refactoring

// grab planets and only keep the ones that have a landscape
// const planets = parser(fs.readFileSync(`${dataLocation}/map.txt`, 'utf-8'), 'planet')
//   .filter(planet => 'landscape' in planet)

// jsonToFile(`${outputJSON}/map/map-planets.json`, planets)

// grab ships ( only the human ones )
// const ships = parser(fs.readFileSync(`${dataLocation}/ships.txt`, 'utf-8'), 'ship')

// jsonToFile(`${outputJSON}/ships/ships.json`, ships)
