const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const dl = require('datalib');

const jsonToFile = require('./jsonToFile');

// load all of the ships
const baseShips = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/ships/', 'all_ships.json')));

// just ship categories as strings, used for looping
const shipCategories = [
  'Transport',
  'Light Freighter',
  'Heavy Freighter',
  'Interceptor',
  'Light Warship',
  'Medium Warship',
  'Heavy Warship',
  'Fighter',
  'Drone'
];

// the equations for generating stats in a faction as category
// just pass in mass
let equations = {
  coalition: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  drak: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  generic: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  hai: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  kestrel: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  korath: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  marauders: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  pug: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  quarg: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  },
  wanderer: {
    'Transport': {},
    'Light Freighter': {},
    'Heavy Freighter': {},
    'Interceptor': {},
    'Light Warship': {},
    'Medium Warship': {},
    'Heavy Warship': {},
    'Fighter': {},
    'Drone': {}
  }
};

// filter, return all ships of category from a faction
const extractFromFaction = (faction, category) => {
  return _.filter(baseShips[faction], function(ship) {
    if(ship.attributes) {
      return ship.attributes.category === category;
    }
  });
};

// linear regression based on data [[mass, atrr], [mass, atrr]..]
// returns the function to get y based on x
const dlLinearRegression = (data) => {
  let mapData = data;
  // perform linear regression analysis
  // variable lin contains the model
  let lin = dl.linearRegression(mapData,
    function(d) {
      return d[0];
    },
    function(d) {
      return d[1];
    }
  );

  // function to calulate y (attribute) given x (mass)
  //return (x) => lin.slope * x + lin.intercept;
  return [lin.slope, lin.intercept];
};


// compile data from each ship as [[mass, atrr], [mass, atrr]]
// then returns the equation
const testData = (ships, attribute, subProp = false) => {
  let data = [];

  for (var i=0; i<ships.length; i++) {
    let mass = ships[i].attributes.mass;
    // x, y
    let match = !subProp ?
      [mass, ships[i].attributes[attribute]] :
      [mass, ships[i].attributes[subProp][attribute]];

    data.push(match);
  }

  return dlLinearRegression(data);
};

// when no mass is provided generate mass that's
// between the massRange
const massRange = (ships) => {
  let masses = [];
  for (var i=0; i<ships.length; i++) {
    masses.push(ships[i].attributes.mass);
  }
  
  const min = Math.min.apply(null, masses),
    max = Math.max.apply(null, masses);

  return {
    minMass: min,
    maxMass: max
  };
};

// generates equation for each attribute in category of faction
const generateEquations = (faction, category) => {
  const shipsOfType = extractFromFaction(faction, category);
  // prevent executing on: factions w/o category or less than 2 ship
  if(shipsOfType.length > 1) {
    return equations[faction][category] = {
      massRange: massRange(shipsOfType),
      bunks: testData(shipsOfType, 'bunks'),
      cargoSpace: testData(shipsOfType, 'cargoSpace'),
      cost: testData(shipsOfType, 'cost'),
      drag: testData(shipsOfType, 'drag'),
      engineCap: testData(shipsOfType, 'engineCap'),
      fuelCap: testData(shipsOfType, 'fuelCap'),
      heat: testData(shipsOfType, 'heat'),
      hull: testData(shipsOfType, 'hull'),
      outfitSpace: testData(shipsOfType, 'outfitSpace'),
      requiredCrew: testData(shipsOfType, 'requiredCrew'),
      shields: testData(shipsOfType, 'shields'),
      weaponCap: testData(shipsOfType, 'weaponCap'),

      weapon: {
        blastRadius: testData(shipsOfType, 'blastRadius', 'weapon'),
        hitForce: testData(shipsOfType, 'hitForce', 'weapon'),
        hullDamage: testData(shipsOfType, 'hullDamage', 'weapon'),
        shieldDamage: testData(shipsOfType, 'shieldDamage', 'weapon'),
      }
    };
  }
};


// create a ship based on mass, using equation object
// for testing
const generateShip = (mass, equation) => {
  //return (x) => lin.slope * x + lin.intercept;
  //return [lin.slope, lin.intercept];
  return  {
    bunks: Math.ceil(equation.bunks[0] * mass + equation.bunks[1]),
    cargoSpace: Math.ceil(equation.cargoSpace[0] * mass + equation.cargoSpace[1]),
    cost: Math.ceil(equation.cost[0] * mass + equation.cost[1]),
    drag: Math.ceil(equation.drag[0] * mass + equation.drag[1]),
    engineCap: Math.ceil(equation.engineCap[0] * mass + equation.engineCap[1]),
    fuelCap: Math.ceil(equation.fuelCap[0] * mass + equation.fuelCap[1]),
    heat: (equation.heat[0] * mass + equation.heat[1]).toFixed(2),
    hull: Math.ceil(equation.hull[0] * mass + equation.hull[1]),
    outfitSpace: Math.ceil(equation.outfitSpace[0] * mass + equation.outfitSpace[1]),
    requiredCrew: Math.ceil(equation.requiredCrew[0] * mass + equation.requiredCrew[1]),
    shields: Math.ceil(equation.shields[0] * mass + equation.shields[1]),
    weaponCap: Math.ceil(equation.weaponCap[0] * mass + equation.weaponCap[1]),

    weapon: {
      blastRadius: Math.ceil(equation.weapon.blastRadius[0] * mass + equation.weapon.blastRadius[1]),
      hitForce: Math.ceil(equation.weapon.hitForce[0] * mass + equation.weapon.hitForce[1]),
      hullDamage: Math.ceil(equation.weapon.hullDamage[0] * mass + equation.weapon.hullDamage[1]),
      shieldDamage: Math.ceil(equation.weapon.shieldDamage[0] * mass + equation.weapon.shieldDamage[1]),
    }
  };
};

const generateAllEquations = () => {
  // array of faction keys in equation object
  const factions = Object.keys(equations);

  for (var i=0; i<factions.length; i++) {
    // array of category keys in the faction
    let categories = Object.keys(equations[factions[i]]);
    for (var j=0; j<categories.length; j++) {
      generateEquations(factions[i], categories[j]);
    }
  }

  jsonToFile(path.join(__dirname, '../json/', 'generation_equations.json'), equations);
};



// testing

//generateAllEquations();
//console.log(generateShip(50, equations.generic.Interceptor));

// generateEquations('wanderer', 'Medium Warship');
// console.log(generateShip(300, equations.wanderer['Medium Warship']))



module.exports = {
  generateShip,
  generateEquations,
  generateAllEquations,
  equations,
};
