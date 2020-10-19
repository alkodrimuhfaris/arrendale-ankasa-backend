const db = require('../helpers/db')
const getFromDB = require('../helpers/promiseToDB')
const transactionToDB = require('../helpers/transactionToDB')

const table = 'items'
let query = ''


module.exports = {
  getCity: async (cityId, tables='city') => {
    query = `SELECT *
            FROM ${tables}
            WHERE id = ?`
    return await getFromDB(query, cityId)
  },
  getFlight: async (origin, destination, departure_date, limiter, tables = 'flight') => {
    query = `SELECT * 
            FROM (
              SELECT id, airlines_id, origin, date(departure_time) as departure_date, time(departure_time) as departure_time, destination, date(arrived_time) as arrived_date, time(arrived_time) as arrived_time
              FROM ${tables}
            ) as ${tables}
            LEFT JOIN (
              SELECT flight_id, class, seat_count, min(price) as price
              FROM flight_detail
              GROUP BY flight_id               
            ) AS flight_detail
            ON ${tables}.id = flight_detail.flight_id
            WHERE origin = ?
            OR destination = ?
            OR departure_date = ?
            ${limiter}`
    return await getFromDB(query, [origin, destination, departure_date])
  },
  getFlightCount: async (origin, destination, departure_date, tables='flight') => {
    query = `SELECT count(flightCount.id) as count From (
              SELECT *
              FROM (
                SELECT id, airlines_id, origin, date(departure_time) as departure_date, time(departure_time) as departure_time, destination, date(arrived_time) as arrived_date, time(arrived_time) as arrived_time
                FROM ${tables}
              ) as ${tables}
              LEFT JOIN (
                SELECT flight_id, class, seat_count, min(price) as price
                FROM flight_detail
                GROUP BY flight_id                
              ) AS flight_detail
              ON ${tables}.id = flight_detail.flight_id
              WHERE origin = ?
              OR destination = ?
              OR departure_date = ?
            ) as flightCount`
    return await getFromDB(query, [origin, destination, departure_date])
  },
  createFlight: async (flight, flightDetail) => {
    query = [ ['INSERT INTO flight SET ?', [flight]], 
              ['INSERT INTO flight_detail (class, seat_count, price, flight_id) VALUES ?', flightDetail]]
    return await transactionToDB(query)
  },
  getFlightDetail: async (data) => {
    query = `SELECT *
            FROM flight_detail
            WHERE ?`
    return await getFromDB(query, data)
  }
}