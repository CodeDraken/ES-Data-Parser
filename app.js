const shipScraper = require('./scrapers/ship_scraper');
const outfitScraper = require('./scrapers/outfit_scraper');
const { shipSalesJSON } = require('./scrapers/sales_scraper');

const { jsonToFile } = require('./util/jsonToFile');


const scrapeWriteAll = (type) => {
  if(type === 'ships') {
    shipScraper.scrapeAllShips();
    const ships = shipScraper.ships;
    
    // all ships, 1 file
    jsonToFile('./json/ships/all_ships.json', ships);

    // individual faction files
    for (var faction in ships) {
      if (ships.hasOwnProperty(faction)) {
        jsonToFile(`./json/ships/${faction}.json`, ships[faction]);
      }
    }
  } else if(type === 'outfits') {
    // scrape and write all outfits
    outfitScraper.scrapeAllOutfits();
    jsonToFile('./json/outfits/outfits.json', outfitScraper.outfits);
  }
};


scrapeWriteAll('ships');
scrapeWriteAll('outfits');

jsonToFile('./json/sales_ships.json', shipSalesJSON);
