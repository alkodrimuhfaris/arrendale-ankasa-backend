const db = require('../helpers/db')
const getFromDB = require('../helpers/promiseToDB')

const table = 'items'
let query = ''


module.exports = {
  getCity: async (cityId, tables='city') => {
    query = `SELECT *
            FROM ${tables}
            WHERE id = ?`
    getFromDB(query, cityId)
  },
  getFlight: async (origin, destination, departure_time, tables = 'flight') => {
    query = `SELECT * FROM (SELECT id, airlines_id, origin, date(departure_time) as departure_date, time(departure_time) as departure_time, destination, date(arrived_time) as arrived_date, time(arrived_time) as arrived_time
              FROM ${flight}) as flight
            LEFT JOIN (
                SELECT flight_id, class, seat_count, price
                FROM flight_detail               
            ) AS flight_detail
            ON flight.id = flight_detail.flight_id
            WHERE origin = ?
            OR destination = ?
            OR departure_date = ?`
    getFromDB(query, [origin, destination, departure_time])
  }
}