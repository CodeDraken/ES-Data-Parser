const path = require('path')

module.exports = {
  dataLocation: path.join(__dirname, '../', 'data', 'sorted_data'),
  outputGameFiles: path.join(__dirname, '../', 'generated_game_files'),
  outputJSON: path.join(__dirname, '../', 'json')
}
