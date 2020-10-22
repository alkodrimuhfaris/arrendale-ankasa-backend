const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const pagination = require('../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const ticketModel = require('../models/ticket')

module.exports = {
  getAllTicket: async (req, res) => {
    const path = 'ticket'
    const {id:user_id} = req.user
    if(!user_id) {return responseStandard(res, 'Forbidden Acces!', {}, 403, false)}
    try {
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await ticketModel.getAllTicket(user_id, limiter)
      const [{count}] = await ticketModel.getAllTicketCount(user_id) || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of all ticket of user with id '+user_id, {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  },
  getTicketById: async (req, res) => {
    const {id:user_id} = req.user
    let {id:ticket_id} = req.params
    ticket_id = Number(ticket_id)
    if(!user_id) {return responseStandard(res, 'Forbidden Acces!', {}, 403, false)}
    try {
      const ticket = await ticketModel.getTicketById(user_id, ticket_id)
      if (ticket.length) {
        return responseStandard(res, 'Ticket on id: '+ticket_id, {ticket})
      }
      else {
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  },
  getTicketByBookingId: async (req, res) => {
    const {id:user_id} = req.user
    let {id:booking_id} = req.params
    booking_id = Number(booking_id)
    const path='ticket/booking/'+booking_id
    if(!user_id) {return responseStandard(res, 'Forbidden Acces!', {}, 403, false)}
    try {
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await ticketModel.getTicketByBookingId(user_id, booking_id, limiter)
      const [{count}] = await ticketModel.getTicketByBookingIdCount(user_id, booking_id) || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of all ticket of booking id: '+booking_id, {result, pageInfo})
      }
      else {
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  }
}