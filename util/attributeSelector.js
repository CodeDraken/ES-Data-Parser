// get an attribute's value
const attrSelector = (attribute, data, trim) => {
  const attrRegex = new RegExp(`"?${attribute}"? (.*)`, 'gi');
  const result = attrRegex.exec(data);

  if(result !== null) {
    return trim === true ? result[1].replace(/"+/g, '') : result[1];
  } else {
    return false;
  }
};

module.exports = attrSelector;
