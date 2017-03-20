const shipScraper = require('./scrapers/ship_scraper');
const outfitScraper = require('./scrapers/outfit_scraper');
const jsonToFile = require('./util/jsonToFile');


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
  }
};


//scrapeWriteAll('ships');
