const fs = require('fs');

// regex
const 
  shipReg =  /ship "([\s\S]*?)((?=ship ".*)|(?:description .*))/g ,
  nameReg = /ship/;

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
    const explosions = ship.match(/explode (".*)/g);

    return {
      engines: Array.isArray(engines) ? engines.map( item => item.replace(/[a-zA-Z]*/g, '').trim()) : engines,
      guns,
      turrets,
      explosions
    };
  } catch (err) {
    //console.log('layout error: ', ship, err)
    if(!retry) {
      console.log('a ship failed retrying..');
      layoutSelector(ship[0], true);
    }
  }
};

const shipGenerator = (faction, data) => {
  if( data && data.length > 1 && Array.isArray(data) ) {
    for (var i=0; i<data.length; i++) {
      const ship = {
          name: attrSelector('ship', data[i], true),
          sprite: attrSelector('sprite', data[i], true),

          attributes: {
            category: attrSelector('category', data[i], true),
            cost: attrSelector('cost', data[i]),
            hull: attrSelector('hull', data[i]),
            mass: attrSelector('mass', data[i]),
            drag: attrSelector('drag', data[i]),
            heat: attrSelector('heat dissipation', data[i]),
            outfitSpace: attrSelector('outfit space', data[i]),
            weaponCap: attrSelector('weapon capacity', data[i]),
            engineCap: attrSelector('engine capacity', data[i]),
            automation: attrSelector('automation', data[i]),
            weapon: {
              blastRadius: attrSelector('blast radius', data[i]),
              shieldDamage: attrSelector('shield damage', data[i]),
              hullDamage: attrSelector('hull damage', data[i]),
              hitForce: attrSelector('hit force', data[i])
            }
          },

          outfits: outfitSelector(data[i]),

          layout: layoutSelector(data[i]),
          
          description: attrSelector('description', data[i])
      };
      ships[faction][ship.name.toLowerCase()] = ship;
    }
  } else if(data) {
    const ship = {
        name: attrSelector('ship', data, true),
        sprite: attrSelector('sprite', data, true),

        attributes: {
          category: attrSelector('category', data, true),
          cost: attrSelector('cost', data),
          hull: attrSelector('hull', data),
          mass: attrSelector('mass', data),
          drag: attrSelector('drag', data),
          heat: attrSelector('heat dissipation', data),
          outfitSpace: attrSelector('outfit space', data),
          weaponCap: attrSelector('weapon capacity', data),
          engineCap: attrSelector('engine capacity', data),
          automation: attrSelector('automation', data),
          weapon: {
            blastRadius: attrSelector('blast radius', data),
            shieldDamage: attrSelector('shield damage', data),
            hullDamage: attrSelector('hull damage', data),
            hitForce: attrSelector('hit force', data)
          }
        },

        outfits: outfitSelector(data),

        layout: layoutSelector(data),
        
        description: attrSelector('description', data)
    };
    
    ships[faction][ship.name.toLowerCase()] = ship;
  }
}


const scrapeFaction = (faction, fileName, single) => {
   let fileText = !single ? fs.readFileSync(`${__dirname}/data/ships/${fileName}.txt`, 'utf8') :
                  fs.readFileSync(`${__dirname}/data/singles/${fileName}.txt`, 'utf8');
  let shipScrape = fileText.match(shipReg);

  shipGenerator(faction, shipScrape);
}


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
}


const writeToFile = (obj) => {
  const json = JSON.stringify(obj);
  fs.writeFileSync('./json/ships.json', json);
}


scrapeAllShips();
writeToFile(ships);
