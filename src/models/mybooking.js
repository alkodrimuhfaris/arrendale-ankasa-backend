const db = require('../helpers/db')
const getFromDB = require('../helpers/promiseToDB')
const transactionToDB = require('../helpers/transactionToDB')

let query = ''

module.exports = {
  getBooking: (user_id, limiter) => {
    query = `SELECT *
            FROM booking
            WHERE ?
            ${limiter}`
    return await getFromDB(query, user_id)
  },
  getBookingCount: (user_id) => {
    query = `SELECT count(booking.id) as count
            FROM booking
            WHERE ?`
    return await getFromDB(query, user_id)
  },
  getBookingById: (booking_id) => {
    query = `SELECT *
            FROM booking
            WHERE booking.id = ?`
    return await getFromDB(query, booking_id)
  },
  createBooking: (booking) => {
    query = `INSERT INTO booking SET ?`
    return await getFromDB(query, booking)
  },
  updateStatusBooking: (booking_id) => {
    query = `UPDATE booking
            SET status = 1
            WHERE id = ?`
    return await getFromDB(query, booking_id)
  },
  createPassanger: (passangerData) => {
    query = `INSERT INTO passanger SET ?`
    return await getFromDB(query, passangerData)
  }
}