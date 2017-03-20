// get an attribute's value
const attrSelector = (attribute, data, trim) => {
  const attrRegex = new RegExp(`"?${attribute}"? (.*)`, 'g');
  const result = attrRegex.exec(data);

  if(result !== null) {
    return trim === true ? result[1].replace(/"+/g, '') : result[1];
  } else {
    return 0;
  }
};

module.exports = attrSelector;
