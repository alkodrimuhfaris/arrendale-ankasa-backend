module.exports = {
  ticketGen: (user_id, booking_id) => {
    let ticket_code = 'ANKASA'.concat(Date.now()).concat(user_id).concat(booking_id)
    return ticket_code
  }
}