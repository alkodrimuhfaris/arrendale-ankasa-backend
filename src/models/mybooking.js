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
  }
}