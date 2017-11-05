const fs = require('fs')
const _ = require('lodash')

const dataConfig = require('../config/dataConfig')
const { shipRegex, equipedOutfitRegex } = require('../config/regexConfig')
const attrSelector = require('../util/attributeSelector')

// ships by faction
const shipFileArr = [
  ...fs.readdirSync(`${dataConfig.dataLocation}/ships`)
  .map(shipFileName => shipFileName.replace('.txt', '')),
  ...fs.readdirSync(`${dataConfig.dataLocation}/mix`)
  .map(shipFileName => shipFileName.replace('.txt', ''))
]

const ships = shipFileArr.reduce((shipObj, ship) => {
  shipObj[ship] = {}
  return shipObj
}, {})

// fetch a ship for inheriting
const inherit = (ship, faction) => {
  return ships[faction][ship.toLowerCase()]
}

// return all outfits in an array
const outfitSelector = (ship) => {
  const result = equipedOutfitRegex.exec(ship)

  return result != null ? result[1].replace(/\t|"/g, '').trim().split('\n') : false
}

// return the layout in arrays
const layoutSelector = (ship, retry) => {
  try {
    // num selectors
    const engines = ship.match(/engine (-?\d.*)/g)
    const guns = ship.match(/gun (-?\d*.*)/g)
    const turrets = ship.match(/turret (-?\d.*)/g)
    const fighter = ship.match(/fighter (-?\d.*)/g)

    // string selectors
    const explosions = ship.match(/explode (".*)/g)

    return {
      // return number only for engine
      engines: engines,
      explosions,
      fighter,
      guns,
      turrets
    }
  } catch (err) {
    // retry once assuming it's an array (works for drak)
    if (!retry) {
      console.warn('a ship failed retrying..')
      layoutSelector(ship[0], true)
    } else {
      console.error('Retry failed')
    }
  }
}

// create a ship object from string of data
const scrapeShip = (shipStr, faction) => {
  const attributes = [
    'ship', 'sprite', 'bunks', 'cargo space', 'category', 'cost',
    'drag', 'engine capacity', 'fuel capacity', 'heat dissipation',
    'hull', 'mass', 'outfit space', 'required crew', 'shields',
    'weapon capacity', 'blast radius', 'hit force', 'hull damage', 'shield damage',
    'description'
  ]
  const locAttributes = ['engine', 'gun', 'fighter', 'turret', 'explode', 'final explode']
  const attrGroups = ['weapon', 'attributes', 'outfits']
  let data = shipStr

  // some special cases end up being an array
  data = Array.isArray(data) ? data[0] : data

  // the line where the ship name is
  const nameLine = data.match(/^ship .*/gm)[0]
  // regex to get the base name
  const nameReg = new RegExp('^ship "(.*?)"', 'gm')
  // name of the base ship ie shield beetle
  const name = nameReg.exec(data)[1]
  // count occurences of the ship name
  const nameCountReg = new RegExp(name, 'g')
  const nameCount = nameLine.match(nameCountReg).length

  // test the amount the name occurs, if more than once assume it inherits
  if (nameCount < 2) {
    // don't inherit
    const ship = {
      name: attrSelector('ship', data, true),
      sprite: attrSelector('sprite', data, true),

      attributes: {
        automaton: attrSelector('automaton', data),
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
          shieldDamage: attrSelector('shield damage', data)
        }
      },

      outfits: outfitSelector(data),

      layout: layoutSelector(data),

      description: attrSelector('description', data, true)
    }

    data = data.replace(equipedOutfitRegex, '')

    attributes.forEach(attr => {
      const re = new RegExp(`"?${attr}"? .*`, 'g')
      data = data.replace(re, '')
    })

    locAttributes.forEach(attr => {
      const re = new RegExp(`.*${attr}.*`, 'g')
      data = data.replace(re, '')
    })

    attrGroups.forEach(attr => {
      const re = new RegExp(`.*${attr}.*`, 'g')
      data = data.replace(re, '')
    })

    const extra = data
      .trim()
      .split('\n')
      .map(line =>
        line
          .trim()
          .split(/ (?=\d)/)
      )
      .reduce((extraObj, attr) => {
        if (attr[0] && attr[1]) {
          extraObj[attr[0].replace(/"/g, '')] = attr[1]
        }

        return extraObj
      }, {})

    ship.extra = extra

    return ship
  } else {
    // probably inherit
    let parentShip = inherit(name, faction)
    const parentAttr = parentShip.attributes
    const childOutfits = outfitSelector(data)
    const childLayout = layoutSelector(data)

    const childShip = _.assign({}, parentShip, {
      name: attrSelector('ship', data, true),
      attributes: {
        automaton: attrSelector('automaton', data) || parentAttr.automaton,
        bunks: attrSelector('bunks', data) || parentAttr.bunks,
        cargoSpace: attrSelector('cargo space', data) || parentAttr.cargoSpace,
        category: attrSelector('category', data, true) || parentAttr.category,
        cost: attrSelector('cost', data) || parentAttr.cost,
        drag: attrSelector('drag', data) || parentAttr.drag,
        engineCap: attrSelector('engine capacity', data) || parentAttr.engineCap,
        fuelCap: attrSelector('fuel capacity', data) || parentAttr.fuelCap,
        heat: attrSelector('heat dissipation', data) || parentAttr.heat,
        hull: attrSelector('hull', data) || parentAttr.hull,
        mass: attrSelector('mass', data) || parentAttr.mass,
        outfitSpace: attrSelector('outfit space', data) || parentAttr.outfitSpace,
        requiredCrew: attrSelector('required crew', data) || parentAttr.requiredCrew,
        shields: attrSelector('shields', data) || parentAttr.shields,
        weaponCap: attrSelector('weapon capacity', data) || parentAttr.weaponCap,

        weapon: {
          blastRadius: attrSelector('blast radius', data) || parentAttr.weapon.blastRadius,
          hitForce: attrSelector('hit force', data) || parentAttr.weapon.hitForce,
          hullDamage: attrSelector('hull damage', data) || parentAttr.weapon.hullDamage,
          shieldDamage: attrSelector('shield damage', data) || parentAttr.weapon.shieldDamage
        }
      },
      outfits: childOutfits || parentShip.outfits,
      layout: {
        'engines': childLayout.engines || parentShip.layout.engines,
        'explosions': childLayout.explosions || parentShip.layout.explosions,
        'fighter': childLayout.fighter || parentShip.layout.fighter,
        'guns': childLayout.guns || parentShip.layout.guns,
        'turrets': childLayout.turrets || parentShip.layout.turrets
      }
    })

    return childShip
  }
}

// generate ships from array of strings, put into ships[faction]
const shipFactory = (faction, arrOfFactionShips) => {
  const data = arrOfFactionShips
  if (data && data.length > 1 && Array.isArray(data)) {
    // for many ships
    data.forEach(shipStr => {
      const ship = scrapeShip(shipStr, faction)

      ships[faction][ship.name.toLowerCase()] = ship
    })
    // for (var i = 0; i < data.length; i++) {
    //   const ship = scrapeShip(data[i], faction)

    //   ships[faction][ship.name.toLowerCase()] = ship
    // }
  } else if (data) {
    // for single ship
    const ship = scrapeShip(data, faction)

    ships[faction][ship.name.toLowerCase()] = ship
  }
}

// read file, find all ships as strings, generate ships
const scrapeFaction = faction => {
  // different paths for files with ships only and ones with
  // outfits, ships, and whatever
  const fileText = (() => {
    try {
      return fs.readFileSync(`${dataConfig.dataLocation}/ships/${faction}.txt`, 'utf8')
    } catch (err) {
      return fs.readFileSync(`${dataConfig.dataLocation}/mix/${faction}.txt`, 'utf8')
    }
  })()

  // array of ship strings
  const arrOfFactionShips = fileText.match(shipRegex)

  shipFactory(faction, arrOfFactionShips)
}

// scrape all current factions then write to file
// dynamically generate ships object and scrape
const scrapeAllShips = () => {
  for (let faction in ships) {
    scrapeFaction(faction)
  }
}

// testing
scrapeFaction('pug')

module.exports = {
  scrapeShip,
  scrapeFaction,
  scrapeAllShips,
  shipFactory,
  ships
}
