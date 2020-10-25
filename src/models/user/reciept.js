const getFromDB = require('../../helpers/promiseToDB')

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
  },
  getAllTransaction: async (user_id={}, limiter) => {
    query = `SELECT * FROM reciept
            LEFT JOIN (
              SELECT count(id) as transaction_count, reciept_id
              FROM reciept_detail
            ) AS reciept_detail
            ON reciept.id = reciept_detail.reciept_id
            WHERE ?
            ${limiter}`
    return await getFromDB(query, user_id)
  },
  getAllTransactionCount: async (user_id={}) => {
    query = `SELECT count(reciept.id) as count FROM reciept
            LEFT JOIN (
              SELECT count(id) as transaction_count, reciept_id
              FROM reciept_detail
            ) AS reciept_detail
            ON reciept.id = reciept_detail.reciept_id
            WHERE ?`
    return await getFromDB(query, user_id)
  },
  getTransactionById: async (user_id, reciept_id) => {
    query = `SELECT * FROM reciept
            WHERE user_id = ?
            AND id = ?`
    return await getFromDB(query, [user_id, reciept_id])
  },
  getDetailTransaction: async (reciept_id, limiter) => {
    query = `SELECT * FROM reciept_detail
            WHERE reciept_id = ?
            ${limiter}`
    return await getFromDB(query, reciept_id)
  },
  getDetailTransactionCount: async (reciept_id) => {
    query = `SELECT count(id) as count FROM reciept_detail
            WHERE reciept_id = ?`
    return await getFromDB(query, reciept_id)
  }
}