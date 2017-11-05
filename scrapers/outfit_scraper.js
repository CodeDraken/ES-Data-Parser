const fs = require('fs')

const attrSelector = require('../util/attributeSelector')

const outfitReg = /^outfit "([\s\S]*?)((?=^outfit ".*)|(?:description .*)|(?=end))/gm

// Ammunition: {},
// Engines: {},
// Guns: {},
// 'Hand to Hand': {},
// 'Secondary Weapons': {},
// Special: {},
// Systems: {},
// Turrets: {}

const outfits = {}

// create a single outfit object
const createOutfit = (data) => {
  // all outfits should have these
  const outfit = {
    name: attrSelector('outfit', data, true)
  }
  // may or may not have any of these
  const attrList = [
    'energy generation', 'heat generation', 'engine capacity',
    'weapon capacity', 'energy capacity', 'turn', 'turn energy',
    'turn heat', 'thrust', 'thrust energy', 'thrust heat',
    'turret mounts', 'gun ports', 'sprite', 'inaccuracy',
    'velocity', 'lifetime', 'reload', 'firing energy', 'firing heat', 'acceleration', 'drag', 'homing', 'tracking', 'shield damage',
    'hull damage', 'hit force', 'required crew', 'burst reload',
    'burst count', 'cluster', 'heat damage', 'missile strength',
    'piercing', 'infrared tracking', 'ion damage', 'shield generation', 'shield energy', 'shield heat', 'drag', 'anti-missile', 'submunition', 'radar tracking', 'radar jamming', 'ramscoop', 'jump speed', 'hyperdrive', 'scram drive', 'jump drive', 'cargo scan power',
    'cargo scan speed', 'drag', 'outfit scan power', 'outfit scan speed', 'atmosphere scan', 'cloak', 'cloaking energy', 'cloaking fuel', 'unplunderable', 'bunks', 'fuel capacity', 'scan interference', 'capture attack', 'capture defense', 'illegal', 'map', 'category', 'cost', 'thumbnail', 'mass', 'outfit space', 'description']

  attrList.forEach((attr) => {
    const testAttr = attrSelector(attr, data, true)
    testAttr ? outfit[attr] = testAttr : ''
  })

  return outfit
}

// generate outfit from array of strings
const outfitGenerator = (data) => {
  if (data && data.length > 1 && Array.isArray(data)) {
    // for many outfit
    for (var i = 0; i < data.length; i++) {
      const outfit = createOutfit(data[i])

      outfits[outfit.name.toLowerCase()] = outfit
    }
  } else if (data) {
    // for single outfit
    const outfit = createOutfit(data)

    outfits[outfit.name.toLowerCase()] = outfit
  }
}

// read file, find all outfits as strings, generate outfits
const scrapeFile = (fileName, single) => {
  // different paths for files with outfits only and ones with
  // outfits, outfits, and whatever
  const fileText = !single
  ? fs.readFileSync(`${__dirname}/data/outfits/${fileName}.txt`, 'utf8')
  : fs.readFileSync(`${__dirname}/data/singles/${fileName}.txt`, 'utf8')

  // array of outfit strings
  const outfitScrape = fileText.match(outfitReg)

  // fs.writeFileSync('./test.txt', outfitScrape);
  outfitGenerator(outfitScrape)
}

const scrapeAllOutfits = () => {
  const files = fs.readdirSync(`${__dirname}/data/outfits`)
  files.forEach((file) => {
    scrapeFile(file.replace('.txt', ''))
  })
}

scrapeAllOutfits()

module.exports = {
  outfits,
  scrapeAllOutfits
}
