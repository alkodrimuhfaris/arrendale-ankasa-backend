const getFromDB = require('../helpers/promiseToDB')

let query = ''

module.exports = {
  createReciept: async (reciptData) => {
    query = `INSERT INTO reciept SET ?`
    return await  getFromDB(query, reciptData)
  },
  createRecieptDetail: async (recieptData) => {
    query = `INSERT INTO reciept_detail
            (reciept_id,transaction,quantity,price)
            VALUES ?`
    return await getFromDB(query, recieptData)
  }
}