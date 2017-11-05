const readLastLines = require('read-last-lines')

const shipScraper = require('./scrapers/ship_scraper')
const outfitScraper = require('./scrapers/outfit_scraper')
const { shipSalesJSON } = require('./scrapers/sales_scraper')
const { jsonToFile } = require('./util/jsonToFile')
const dataConfig = require('./config/dataConfig')
const attrEquationGen = require('./util/attr_equation_gen')
const { filePrep } = require('./util/fileUtil')

// TODO: if END isn't at end of files then add it
// prep files
// filePrep()

const scrapeWriteAll = (type) => {
  if (type === 'ships') {
    shipScraper.scrapeAllShips()
    const ships = shipScraper.ships

    // all ships, 1 file
    jsonToFile(`${dataConfig.outputJSON}/ships/all_ships.json`, ships)

    // individual faction files
    for (var faction in ships) {
      if (ships.hasOwnProperty(faction)) {
        jsonToFile(`${dataConfig.outputJSON}/ships/${faction}.json`, ships[faction])
      }
    }
  } else if (type === 'outfits') {
    // scrape and write all outfits
    outfitScraper.scrapeAllOutfits()
    jsonToFile(`${dataConfig.outputJSON}/outfits/outfits.json`, outfitScraper.outfits)
  }
}

scrapeWriteAll('ships')
scrapeWriteAll('outfits')
attrEquationGen.generateAllEquations()

jsonToFile(`${dataConfig.outputJSON}/sales_ships.json`, shipSalesJSON)
