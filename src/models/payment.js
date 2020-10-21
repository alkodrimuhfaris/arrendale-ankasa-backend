const getFromDB = require('../helpers/promiseToDB')

let query = ''

module.exports = {
  topUpBalance: async (balance, id) => {
    query = `UPDATE users
            SET balance = ?
            WHERE id = ?`
    return await getFromDB(query, [balance, id])
  },
  deductBalance: async (data=[]) => {
    query = `UPDATE users
            SET balance = ?
            WHERE id = ?`
    return await getFromDB(query, data)
  },
  getUserBalance: async (user_id) => {
    query = `SELECT balance
            FROM users
            WHERE id = ?`
    return await getFromDB(query, user_id)
  }
}