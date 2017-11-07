const { readdirSync, lstatSync, appendFileSync } = require('fs')
const { join } = require('path')

const dataConfig = require('../config/dataConfig')

const filePrep = () => {
  const allFiles = getAllFiles(dataConfig.dataLocation)

  // add END to end of all data files for easier regex
  allFiles.forEach(file => {
    appendFileSync(file, '{!END!}')
  })
}

const getAllFiles = (dir) => {
  const allFiles = []
  const dirs = getDirectories(dir)

  allFiles.push(...getFiles(dir))

  if (dirs.length > 0) {
    dirs.forEach(sub => {
      allFiles.push(...getAllFiles(sub))
    })
  }

  return allFiles
}

const isDirectory = source => lstatSync(source).isDirectory()

const getDirectories = source =>
readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const getFiles = source =>
readdirSync(source).map(name => join(source, name)).filter((source) => !isDirectory(source))

module.exports = {
  filePrep,
  getFiles,
  getDirectories,
  isDirectory,
  getAllFiles
}
