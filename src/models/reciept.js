const getFromDB = require('../helpers/promiseToDB')

let query = ''

module.exports = {
  createReciept: (reciptData) => {
    query = `INSERT INTO recipt SET ?`
    return await  getFromDB(query, reciptData)
  }
}