const getFromDB = require('../helpers/promiseToDB')

let query = ''

module.exports = {
  topUpBalance: async (data=[]) => {
    query = `UPDATE user
            SET balance = ?
            WHERE id = ?`
    return await getFromDB(query, data)
  },
  deductBalance: async (data=[]) => {
    query = `UPDATE user
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