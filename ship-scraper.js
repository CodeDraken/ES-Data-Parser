const fs = require('fs');

// regex
const shipReg =  /ship "([\s\S]*?)((?=ship ".*)|(?:description .*))/g;

// ship selector
// /ship "([\s\S]*?)(?:description .*)/g /ship "([\s\S]*?)(?:description .*)/g

// "?attr"? (.*) // attribute selector
// "?attr"? "?([\d?\w?\s?]*)
// "?category"? "?([\d?\w? ?]*)

// outfit selector
// outfits([\s\S]*?)(?=\s*?\t*?(engine|gun|explode|turret))

const ships = {
  coalition: {},
  drak: {},
  generic: {},
  hai: {},
  kestrel: {},
  korath: {},
  marauders: {},
  pug: {},
  quarg: {},
  wanderer: {}
};


const attrSelector = (attribute, ship, trim) => {
  const attrRegex = new RegExp(`"?${attribute}"? (.*)`, 'gi');
  const result = attrRegex.exec(ship);

  if(result !== null) {
    return trim === true ? result[1].replace(/"+/g, '') : result[1];
  } else {
    return false;
  }

  
};

const outfitSelector = (ship) => {
  const result = (/outfits([\s\S]*?)(?=\s*?\t*?(engine|gun|explode|turret))/).exec(ship);
  return result != null ? result[1].replace(/\t|"/g, '').trim().split('\n') : false;
};

const layoutSelector = (ship, retry) => {
  try {
    const engines = ship.match(/engine (-?\d.*)/g);
    const guns = ship.match(/gun (-?\d.*)/g);
    const turrets = ship.match(/turret (-?\d.*)/g);
    const fighter = ship.match(/fighter (-?\d.*)/g);

    const explosions = ship.match(/explode (".*)/g);

    return {
      engines: Array.isArray(engines) ? engines.map( item => item.replace(/[a-zA-Z]*/g, '').trim()) : engines,
      explosions,
      fighter,
      guns,
      turrets,
    };
  } catch (err) {
    //console.log('layout error: ', ship, err)
    if(!retry) {
      console.warn('a ship failed retrying..');
      layoutSelector(ship[0], true);
    } else {
      console.error('Retry failed');
    }
  }
};

const scrapeShip = (data) => {
  return {
    name: attrSelector('ship', data, true),
    sprite: attrSelector('sprite', data, true),

    attributes: {
      automation: attrSelector('automation', data),
      bunks: attrSelector('bunks', data),
      cargoSpace: attrSelector('cargo space', data),
      category: attrSelector('category', data, true),
      cost: attrSelector('cost', data),
      drag: attrSelector('drag', data),
      engineCap: attrSelector('engine capacity', data),
      fuelCap: attrSelector('fuel capacity', data),
      heat: attrSelector('heat dissipation', data),
      hull: attrSelector('hull', data),
      mass: attrSelector('mass', data),
      outfitSpace: attrSelector('outfit space', data),
      requiredCrew: attrSelector('required crew', data),
      shields: attrSelector('shields', data),
      weaponCap: attrSelector('weapon capacity', data),

      weapon: {
        blastRadius: attrSelector('blast radius', data),
        hitForce: attrSelector('hit force', data),
        hullDamage: attrSelector('hull damage', data),
        shieldDamage: attrSelector('shield damage', data),
      }
    },

    outfits: outfitSelector(data),

    layout: layoutSelector(data),
    
    description: attrSelector('description', data)
  };
};

const shipGenerator = (faction, data) => {
  if( data && data.length > 1 && Array.isArray(data) ) {
    for (var i=0; i<data.length; i++) {
      const ship = scrapeShip(data[i]);
      ships[faction][ship.name.toLowerCase()] = ship;
    }
  } else if(data) {
    const ship = scrapeShip(data);
    
    ships[faction][ship.name.toLowerCase()] = ship;
  }
};


const scrapeFaction = (faction, fileName, single) => {
  let fileText = !single ? fs.readFileSync(`${__dirname}/data/ships/${fileName}.txt`, 'utf8') :
                  fs.readFileSync(`${__dirname}/data/singles/${fileName}.txt`, 'utf8');
  let shipScrape = fileText.match(shipReg);

  shipGenerator(faction, shipScrape);
};


const scrapeAllShips = () => {
  scrapeFaction('coalition', 'coalition ships');
  scrapeFaction('drak', 'drak', true);
  scrapeFaction('generic', 'ships');
  scrapeFaction('hai', 'hai ships');
  scrapeFaction('kestrel', 'kestrel');
  scrapeFaction('korath', 'korath ships');
  scrapeFaction('marauders', 'marauders');
  scrapeFaction('pug', 'pug', true);
  scrapeFaction('quarg', 'quarg ships');
  scrapeFaction('wanderer', 'wanderer ships');
};


const writeToFile = (obj) => {
  const json = JSON.stringify(obj);
  fs.writeFileSync('./json/ships.json', json);
};


scrapeAllShips();
writeToFile(ships);
