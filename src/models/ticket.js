const getFromDB = require('../helpers/promiseToDB')

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
  }
}