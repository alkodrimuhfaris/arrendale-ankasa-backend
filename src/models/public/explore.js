const db = require('../../helpers/db')
const getFromDB = require('../../helpers/promiseToDB')
const transactionToDB = require('../../helpers/transactionToDB')

const table = 'city'
let query = ''

module.exports = {
  getPopularCity: async (limiter, tables=table) => {
    query = `SELECT *
            FROM ${tables}
            ORDER BY rating DESC
            ${limiter}`
    return await getFromDB(query)
  },
  countPopularCity: async (tables=table) => {
    query = `SELECT count(id) as count
            FROM (
              SELECT *
              FROM ${tables}
              ORDER BY rating DESC
            ) as ${tables}`
    return await getFromDB(query)
  }
}