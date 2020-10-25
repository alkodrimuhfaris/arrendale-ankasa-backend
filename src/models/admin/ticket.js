const getFromDB = require('../../helpers/promiseToDB')

let query = ''

module.exports = {
  getAllTicket: async (limiter) => {
    query = `SELECT * FROM ticket
            ${limiter}`
    return await getFromDB(query)
  },
  getAllTicketCount: async () => {
    query = `SELECT count(id) as count FROM ticket`
    return await getFromDB(query)
  },
  getAllTicketByUserId: async (user_id, limiter) => {
    query = `SELECT * FROM ticket
            WHERE user_id = ?
            ${limiter}`
    return await getFromDB(query, user_id)
  },
  getAllTicketByUserIdCount: async (user_id) => {
    query = `SELECT count(id) as count FROM ticket
            WHERE user_id = ?`
    return await getFromDB(query, user_id)
  },
  getTicketById: async (user_id, ticket_id) => {
    query = `SELECT * FROM ticket
            WHERE user_id = ?
            AND id = ?`
    return await getFromDB(query, [user_id, ticket_id])
  },
  getTicketByBookingId: async (user_id, booking_id, limiter) => {
    query = `SELECT * FROM ticket
            WHERE user_id = ?
            AND booking_id = ?
            ${limiter}`
    return await getFromDB(query, [user_id, booking_id])
  },
  getTicketByBookingIdCount: async (user_id, booking_id) => {
    query = `SELECT count(id) as count FROM ticket
            WHERE user_id = ?
            AND booking_id = ?`
    return await getFromDB(query, [user_id, booking_id])
  },
  deleteTicketById: async (ticket_id) => {
    query = `DELETE FROM ticket
            WHERE ?`
    return await getFromDB(query, {id: ticket_id})
  }
}