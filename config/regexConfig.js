module.exports = {
  shipRegex: /^ship "([\s\S]*?)((?=ship ".*)|(?:description .*)|(?=END))/gm,
  outfitRegex: /^outfit "([\s\S]*?)((?=^outfit ".*)|(?:description .*)|(?=end))/gm,
  shipyardRegex: /shipyard\s(".*")([\s\S]*?)(?=shipyard|\n\n)/gm,
  equipedOutfitRegex: /outfits([\s\S]*?)(?=\s*?\t*?(engine|gun|explode|turret))/
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
