const fs = require('fs');

// convert object to JSON and write to file
const jsonToFile = (path, obj) => {
  const json = JSON.stringify(obj);

  fs.writeFileSync(path, json);
};

module.exports = jsonToFile;
