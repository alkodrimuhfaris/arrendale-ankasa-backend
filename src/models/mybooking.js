const db = require('../helpers/db')
const getFromDB = require('../helpers/promiseToDB')
const transactionToDB = require('../helpers/transactionToDB')

let query = ''

module.exports = {
  getBooking: async (user_id, limiter) => {
    query = `SELECT *
            FROM booking
            WHERE ?
            ${limiter}`
    return await getFromDB(query, user_id)
  },
  getBookingCount: async (user_id) => {
    query = `SELECT count(booking.id) as count
            FROM booking
            WHERE ?`
    return await getFromDB(query, user_id)
  },
  getBookingById: async (booking_id) => {
    query = `SELECT *
            FROM booking
            WHERE booking.id = ?`
    return await getFromDB(query, booking_id)
  },
  getBookingDetail: async (booking_id) => {
    query = `SELECT *
            FROM booking_details
            WHERE booking_id = ?`
    return await getFromDB(query, booking_id)
  },
  getBookingQuantity: async (booking_id) => {
    query = `SELECT count(id) as quantity
            FROM booking_details
            WHERE booking_id = ?`
    return await getFromDB(query, booking_id)
  },
  createBooking: async (booking) => {
    query = `INSERT INTO booking SET ?`
    return await getFromDB(query, booking)
  },
  createBookingDetail: async(bookingDetail) => {
    query = `INSERT INTO booking_details
            (booking_id, passanger_title, passanger_name, passanger_nationality)
            VALUE ?`
    return await getFromDB(query, bookingDetail)
  },
  updateStatusBooking: async (booking_id) => {
    query = `UPDATE booking
            SET status = 1
            WHERE id = ?`
    return await getFromDB(query, booking_id)
  },
  createPassanger: async (passangerData) => {
    query = `INSERT INTO passanger SET ?`
    return await getFromDB(query, passangerData)
  },
  getBookingPrice: async(booking_id) => {
    query = `SELECT price, user_id
            FROM booking
            WHERE id = ?`
    return await getFromDB(query, booking_id)
  },
  getBookingWithDetail: async(user_id, booking_id) => {
    query = `SELECT * 
            FROM (
              SELECT
                id,
                user_id,
                booking_code,
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
                price,
                status
              FROM booking
            ) AS booking
            LEFT JOIN (
              SELECT
                passanger_title,
                passanger_name,
                passanger_nationality,
                booking_id
              FROM booking_details
            ) AS booking_details
            ON booking.id = booking_details.booking_id
            WHERE user_id = ?
            AND booking_id = ?`
    return await getFromDB(query, [user_id, booking_id])
  }
}