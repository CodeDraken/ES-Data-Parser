// get an attribute's value
const attrSelector = (attribute, data, trimQuotes) => {
  const attrRegex = new RegExp(`"?${attribute}"? (.*)`, 'g')
  const result = attrRegex.exec(data)

  if (result !== null) {
    return trimQuotes === true ? result[1].replace(/"+/g, '') : result[1]
  } else {
    return 0
  }
}

module.exports = attrSelector
