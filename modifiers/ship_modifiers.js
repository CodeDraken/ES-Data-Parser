// read json, run a function to create duplicate ships and modify them
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const shipSales = require('../json/sales_ships');
const { objectToShips } = require('../util/jsonToFile');

// multipliers
const usedShipConfig = {
  'mass': 1,
  'bunks': 0.80,
  'cargoSpace': 0.70,
  'cost': 0.70,
  'drag': 1.10,
  'engineCap': 0.85,
  'fuelCap': 0.90,
  'heat': 0.95,
  'hull': 0.80,
  'outfitSpace': 0.9,
  'requiredCrew': 1.25,
  'shields': 0.80,
  'weaponCap': 0.9,
  'weapon': {
    'blastRadius': 1.1,
    'hitForce': 1.1,
    'hullDamage': 1.1,
    'shieldDamage': 1.1
  }
};

const createUsedShips = (shipsFile) => {
  const originalShipsObject = JSON.parse( fs.readFileSync(path.join(__dirname, `../json/ships/${shipsFile}.json`)) );
  const shipKeys = Object.keys(originalShipsObject);
  const usedShips = {};
  
  shipKeys.forEach(key => {
    // create a new ship, add properties from parent, and remove outfits
    usedShips[key] = Object.assign({}, originalShipsObject[key], {
      outfits: ['Hyperdrive']
    });

    // apply multipliers to each key
    _.mergeWith(usedShips[key].attributes, usedShipConfig, (objVal, srcVal) => {
      // on objects like 'weapon' do another merge
      if (_.isObject(objVal)) {
        return _.mergeWith(objVal, srcVal, (objVal2, srcVal2) => Math.floor(objVal2 * srcVal2));
      } else {
        return Math.floor(objVal * srcVal) || objVal;
      }
    });

    // check if values are valid
    const newShip = usedShips[key];
    const newAttr = usedShips[key].attributes;

    // crew
    if (newAttr.bunks < newAttr.requiredCrew) {
      newAttr.bunks = newAttr.requiredCrew;
    }

    // heat dissipation
    if (newAttr.heat < 0.5 || newAttr.heat > 0.9) {
      newAttr.heat = originalShipsObject[key].attributes.heat;
    }

    // fuel
    if (newAttr.fuelCap < 300 && originalShipsObject[key].attributes.fuelCap > 300) {
      newAttr.fuelCap = originalShipsObject[key].attributes.fuelCap;
    }

  });


  objectToShips('../generated_game_files/used-ships.txt', usedShips, '', ' (worn)');
  
  return usedShips;
};

const mapShipsToShipyards = (modShips, shipPrefix = '', shipSuffix = '') => {
  const shipyards = {};

  _.forIn(modShips, modShip => {
    const match = shipSales[modShip.name];
    const shipName = `${shipPrefix}${modShip.name}${shipSuffix}`;
    if (match) {
      match.forEach(shipyard => {
        if (shipyards[shipyard]) {
          shipyards[shipyard] = [...shipyards[shipyard], shipName];
        } else {
          shipyards[shipyard] = [shipName];
        }
      });
    }
  });

  return shipyards;
};

const shipyardsToString = (shipyards) => {
  const shipyardsString = '';

  shipyards.forEach(shipyard => {
    
  });

  console.log(shipyardsString);
};

const usedShips = createUsedShips('generic');

mapShipsToShipyards(usedShips, '', ' (worn)');
