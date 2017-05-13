const fs = require('fs');
const _ = require('lodash');

// convert object to JSON and write to file
const jsonToFile = (path, obj) => {
  const json = JSON.stringify(obj, null, 2);

  fs.writeFileSync(path, json);
};

// convert object to an ES ship file
const objectToShips = (path, obj, prefix = '', suffix = '') => {
  // const shipJSON = JSON.stringify(obj, null, 2);
  // const shipString = shipJSON.replace(/{/g, '').replace(/}/g, '').replace(/:/g, '').trim();

  let shipString = '';

  _.forIn(obj, (ship, key) => {
    const { name, sprite, description, outfits } = ship;
    const { automaton, bunks, cargoSpace, category, cost, drag, engineCap, fuelCap, heat, hull,
            mass, outfitSpace, requiredCrew, shields, weaponCap } = ship.attributes;
    const { blastRadius, hitForce, hullDamage, shieldDamage } = ship.attributes.weapon; 
    //const { engines, explosions, fighter, guns, turrets } = ship.layout;

    let strOutfits = '';
    let strLayout = '';
    try {
      outfits.forEach(outfit => {
        const outfitNum = (outfit.match(/\d/g) || '')[0];
        outfit = outfit.replace(/\d/g, '');
        strOutfits += `"${outfit}" ${outfitNum||''}\n`;
      });

      // remove null values
      const shipLayout = _.omitBy(ship.layout, _.isNil);

      _.forIn(shipLayout, (layoutArr, key) => {
        layoutArr.forEach(layout => {
          strLayout += `${layout}\n  `;
        });
      });
    } catch (err) {}


    shipString += (`
ship "${prefix}${name}${suffix}"
  sprite "${sprite}"
  attributes
    category "${category}"
    "cost" ${cost}
    "shields" ${shields}
    "hull" ${hull}
    "required crew" ${requiredCrew}
    "bunks" ${bunks}
    "mass" ${mass}
    "drag" ${drag}
    "heat dissipation" ${heat}
    "fuel capacity" ${fuelCap}
    "cargo space" ${cargoSpace}
    "outfit space" ${outfitSpace}
    "weapon capacity" ${weaponCap}
    "engine capacity" ${engineCap}
    "automaton" ${automaton}
    weapon
      "blast radius" ${blastRadius}
      "shield damage" ${shieldDamage}
      "hull damage" ${hullDamage}
      "hit force" ${hitForce}
  outfits
    ${strOutfits}
    
  ${strLayout}
  description "${description}"
    `);
  });

  fs.writeFileSync(path, shipString);
};

module.exports = {jsonToFile, objectToShips};

// const example = { 
//   name: 'Aerie',
//   sprite: 'ship/aerie',
//   attributes:
//    { automaton: 0,
//      bunks: '28',
//      cargoSpace: '50',
//      category: 'Medium Warship',
//      cost: '3500000',
//      drag: '4.1',
//      engineCap: '95',
//      fuelCap: '500',
//      heat: '.7',
//      hull: '1900',
//      mass: '130',
//      outfitSpace: '390',
//      requiredCrew: '10',
//      shields: '5700',
//      weaponCap: '150',
//      weapon:
//       { blastRadius: '80',
//         hitForce: '1200',
//         hullDamage: '400',
//         shieldDamage: '800' } },
//   outfits:
//    [ 'Heavy Laser 2',
//      'Heavy Laser Turret 2',
//      'Heavy Anti-Missile Turret',
//      '',
//      'NT-200 Nucleovoltaic',
//      'LP072a Battery Pack',
//      'D41-HY Shield Generator',
//      'Large Radar Jammer',
//      '',
//      'X3700 Ion Thruster',
//      'X3200 Ion Steering',
//      'Hyperdrive' ],
//   layout:
//    { engines: [ '-10 91', '10 91' ],
//      explosions:
//       [ 'explode 'tiny explosion' 10',
//         'explode 'small explosion' 25',
//         'explode 'medium explosion' 25',
//         'explode 'large explosion' 10' ],
//      fighter: [ 'fighter -42 -2', 'fighter 42 2' ],
//      guns: [ 'gun -13 -79 'Heavy Laser'', 'gun 13 -79 'Heavy Laser'' ],
//      turrets:
//       [ 'turret 0 0 'Heavy Anti-Missile Turret'',
//         'turret -17 14 'Heavy Laser Turret'',
//         'turret 17 14 'Heavy Laser Turret'' ] },
//   description: 'The Lionheart Aerie is a light carrier, designed to be just big enough for two fighter bays plus a decent armament of its own. Variations on this same ship design have been in use in the Deep for almost half a millennium, but this model comes with the very latest in generator and weapon technology.' };
