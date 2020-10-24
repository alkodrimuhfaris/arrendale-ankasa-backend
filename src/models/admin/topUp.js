const getFromDB = require('../../helpers/promiseToDB')

let query = ''

module.exports = {
  topUpBalance: async (balance, id) => {
    query = `UPDATE users
            SET balance = ?
            WHERE id = ?`
    return await getFromDB(query, [balance, id])
  }
}