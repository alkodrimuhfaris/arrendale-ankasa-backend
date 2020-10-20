const getFromDB = require('../helpers/promiseToDB')

let query = ''

module.exports = {
  createReciept: async (reciptData) => {
    query = `INSERT INTO reciept SET ?`
    return await  getFromDB(query, reciptData)
  }
}