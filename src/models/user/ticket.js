const getFromDB = require('../../helpers/promiseToDB')

let query = ''

module.exports = {
  createTicket: async (ticketData) => {
    query = `INSERT INTO ticket
            (
              user_id,
              airlines_name,
              airlines_logo,
              flight_code,
              class_name,
              origin,
              origin_city_name,
              origin_city_country,
              departure_date,
              departure_time,
              destination,
              destination_city_name,
              destination_city_country,
              arrived_date,
              arrived_time,
              insurance,
              passanger_title,
              passanger_full_name,
              passanger_nationality,
              booking_id,
              ticket_code) VALUES ?`
    return await  getFromDB(query, ticketData)
  },
  getAllTicket: async (user_id, limiter) => {
    query = `SELECT * FROM ticket
            WHERE user_id = ?
            ORDER BY created_at DESC
            ${limiter}`
    return await getFromDB(query, user_id)
  },
  getAllTicketCount: async (user_id) => {
    query = `SELECT count(id) as count FROM ticket
            WHERE user_id = ?`
    return await getFromDB(query, user_id)
  },
  getTicketById: async (user_id, ticket_id) => {
    query = `SELECT * FROM ticket
            WHERE user_id = ?
            AND id = ?
            ORDER BY created_at DESC`
    return await getFromDB(query, [user_id, ticket_id])
  },
  getTicketByBookingId: async (user_id, booking_id, limiter) => {
    query = `SELECT * FROM ticket
            WHERE user_id = ?
            AND booking_id = ?
            ORDER BY created_at DESC
            ${limiter}`
    return await getFromDB(query, [user_id, booking_id])
  },
  getTicketByBookingIdCount: async (user_id, booking_id, limiter) => {
    query = `SELECT count(id) as count FROM ticket
            WHERE user_id = ?
            AND booking_id = ?`
    return await getFromDB(query, [user_id, booking_id])
  }
}