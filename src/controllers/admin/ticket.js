const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../../helpers/responseStandard')
const pagination = require('../../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const ticketModel = require('../../models/admin/ticket')
const authModel = require('../../models/admin/auth')

module.exports = {
  getAllTicket: async (req, res) => {
    const path = 'manage/ticket'
    const {id:user_id, role_id, identifier} = req.user
    if(role_id !== 1) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

    try {
      let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
      if(adminCheck[0].user_id !== user_id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await ticketModel.getAllTicket(limiter)
      const [{count}] = await ticketModel.getAllTicketCount() || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of all ticket', {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list', {pageInfo})
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  },
  getTicketByUserId: async (req, res) => {
    let {id:user_id} = req.params
    user_id = Number(user_id)
    const path = 'manage/ticket/'+user_id
    const {id:admin_id, role_id, identifier} = req.user
    if(role_id !== 1) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

    try {
      let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
      if(adminCheck[0].user_id !== admin_id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await ticketModel.getAllTicketByUserId(user_id, limiter)
      const [{count}] = await ticketModel.getAllTicketByUserIdCount(user_id) || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of all ticket', {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list', {pageInfo})
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  },
  getTicketByBookingId: async (req, res) => {
    let {id:user_id, booking_id} = req.params
    user_id = Number(user_id)
    booking_id = Number(booking_id)
    console.log(req.params)
    const path = 'manage/ticket/booking/'+user_id+'/'+booking_id
    const {id:admin_id, role_id, identifier} = req.user
    if(role_id !== 1) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

    try {
      let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
      if(adminCheck[0].user_id !== admin_id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await ticketModel.getTicketByBookingId(user_id, booking_id, limiter)
      const [{count}] = await ticketModel.getTicketByBookingIdCount(user_id, booking_id) || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of all ticket of booking id: '+booking_id, {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list', {pageInfo})
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  },
  deleteTicket: async (req, res) => {
    let {id:ticket_id} = req.params
    ticket_id = Number(ticket_id)
    const path = 'manage/ticket/delete/'+ticket_id
    const {id:admin_id, role_id, identifier} = req.user
    if(role_id !== 1) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

    try {
      let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
      if(adminCheck[0].user_id !== admin_id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}
      
      const deleteTicket = await ticketModel.deleteTicketById(ticket_id)
      if (deleteTicket.affectedRows) {
        return responseStandard(res, 'Ticket on id '+ticket_id+' has been deleted', {})
      }
      else {
        return responseStandard(res, 'Failed to delete id', {}, 400, false)
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message, {}, 500, false)
    }
  }
}