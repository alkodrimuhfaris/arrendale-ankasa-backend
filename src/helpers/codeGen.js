module.exports = {
  bookingGen: (user_id) => {
    let ticket_code = 'ANKASA'.concat(Date.now()).concat(user_id)
    return ticket_code
  },
  ticketGen: (user_id, flight_code, booking_id, index) => {
    let ticket_code = Date.now().concat(user_id).concat(flight_code).concat(booking_id).concat(index)
    return ticket_code
  }
}