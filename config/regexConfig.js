module.exports = {
  // selects blocks of code seperated by new lines
  genericGroupRegex: (name) => new RegExp(String.raw`^${name} ([\s\S]*?)(?=(^\s*$^)|({!END!}))`, 'gm'),
  shipRegex: /^ship "([\s\S]*?)((?=ship ".*)|(?:description .*)|(?={!END!}))/gm,
  outfitRegex: /^outfit "([\s\S]*?)((?=^outfit ".*)|(?:description .*)|(?={!END!}))/gm,
  shipyardRegex: /shipyard\s(".*")([\s\S]*?)(?=shipyard|\n\n)/gm,
  equipedOutfitRegex: /outfits([\s\S]*?)(?=\s*?\t*?(engine|gun|explode|turret))/,
  systemRegex: /^system ([\s\S]*?)(?=^\s*$^)/gm,
  systemObjectsRegex: /^\s+?object\s([\s\S]*?)(?={!END!})/gm,
  planetRegex: /^planet ([\s\S]*?)(?=^\s*$^)/gm
}

// NOTES:
// ship selector
// /ship "([\s\S]*?)(?:description .*)/g /ship "([\s\S]*?)(?:description .*)/g
// /^ship "([\s\S]*?)((?=ship ".*)|(?:description .*)|(?=END))/gm
// ^(ship|person) "([\s\S]*?)((?=ship ".*)|(?=person ".*)|(?:description .*)|(?=END))

// attribute selector
// "?attr"? (.*)
// "?attr"? "?([\d?\w?\s?]*)
// "?category"? "?([\d?\w? ?]*)

// outfit selector
// outfits([\s\S]*?)(?=\s*?\t*?(engine|gun|explode|turret))

// system scraper
// /^system ([\s\S]*?)(?=^\s*$^)/gm
