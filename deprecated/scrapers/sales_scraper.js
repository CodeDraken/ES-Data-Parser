const fs = require('fs')

const dataConfig = require('../config/dataConfig')
const { shipyardRegex } = require('../config/regexConfig')

const generateShipSalesJSON = (dataFileName) => {
  const sales = fs.readFileSync(`${dataConfig.dataLocation}/${dataFileName}`, 'utf8')
  const shipSales = {}

  var testArr
  while ((testArr = shipyardRegex.exec(sales)) !== null) {
    const shipyard = testArr[1].replace(/"/g, '').trim()
    const shipListArr = testArr[2].replace(/\t?"?/g, '').trim().split('\n')

    shipListArr.forEach(ship => {
      try {
        if (shipSales[ship]) {
          shipSales[ship] = [...shipSales[ship], shipyard]
        } else {
          shipSales[ship] = [shipyard]
        }
      } catch (err) {}
    })
  }

  return shipSales
}

const shipSalesJSON = generateShipSalesJSON('sales.txt')

module.exports = { shipSalesJSON }
