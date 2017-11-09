module.exports = {
  // selects blocks of code seperated by new lines
  genericGroupRegex: (name) => new RegExp(String.raw`^${name} ([\s\S]*?)(?=(^\s*$^)|({!END!}))`, 'gm')
}
