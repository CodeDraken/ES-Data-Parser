const fs = require('fs');
const path = require('path');

const shipyardRegex = /shipyard\s(".*")([\s\S]*?)(?=shipyard|\n\n)/gm;

const generateShipSalesJSON = (dataFileName) => {
  const sales = fs.readFileSync(path.join(__dirname, `/data/`, dataFileName), 'utf8');
  const shipSales = {};

  var testArr;
  while ((testArr = shipyardRegex.exec(sales)) !== null) {
    const shipyard = testArr[1].replace(/"/g, '').trim();
    const shipListArr = testArr[2].replace(/\t?"?/g, '').trim().split('\n');

    shipListArr.forEach(ship => {
      try {
        if (shipSales[ship]) {
          shipSales[ship] = [...shipSales[ship], shipyard];
        } else {
          shipSales[ship] = [shipyard];
        }
      } catch(err) {}
    });
  }

  return shipSales;
};

const shipSalesJSON = generateShipSalesJSON('sales.txt');

module.exports = { shipSalesJSON };
