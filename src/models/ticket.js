const getFromDB = require('../helpers/promiseToDB')

let query = ''

module.exports = {
  createTicket: (ticketData) => {
    query = `INSERT INTO ticket SET ?`
    return await  getFromDB(query, ticketData)
  }
}