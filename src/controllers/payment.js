const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')
const {v1:uuidv1} = require('uuid')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const bookingModel = require('../models/mybooking')
const payment = require('../models/payment')
const ticketModel = require('../models/ticket')

module.exports= {
  topUpBalance: async (req, res) => {
    //ganti jadi req.user nanti
    let {id:user_id} = req.query
    if(!user_id){return responseStandard(res, 'Access Forbidden!', {}, 500, false)}

    const schemaPayment = joi.object({
      nominal: joi.number().required()
    })
    let { value: nominal, err } = schemaPayment.validate(req.body)
    console.log(nominal)
    if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
    nominal = nominal.nominal
    console.log(nominal)
    try{
      let [{balance}] = await payment.getUserBalance(user_id)
      balance = balance + nominal
      
      let topUp = await payment.topUpBalance(balance, user_id)

      if (topUp.affectedRows) {
        return responseStandard(res, 'Top Up succesfull!', {balance})
      } else {
        return responseStandard(res, 'Top Up failed!', {}, 400, false)
      }
    }catch(err){
      console.log(err)
      return responseStandard(res, 'Internal Server Error', {}, 500, false)
    }
  },
  commitPayment: async (req, res) => {
    //ganti jadi req.user nanti
    let {id} = req.query
    id = Number(id)
    const schemaBooking = joi.object({
      booking_id: joi.number().required()
    })
    let { value: booking_id, err } = schemaBooking.validate(req.body)
    if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
    booking_id = booking_id.booking_id
    console.log(booking_id)
    try {
      let bookingData = await bookingModel.getBookingWithDetail(id, booking_id)
      let {price, user_id, status} = bookingData[0]

      if(id !== user_id){return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

      if(status){return responseStandard(res, 'This booking is already been paid', {}, 400, false)}
      let [{balance}] = await payment.getUserBalance(id)

      //if balance is not enough
      if (price>balance) {return responseStandard(res, 'Your Ankasa Balance is not enough please top up', {}, 400, false)}

      balance = balance - price

      //update balance
      let deductBal = await payment.deductBalance([balance, id])
      if(!deductBal.affectedRows) {return responseStandard(res, 'Internal server error, payment failed', {}, 400, false)}

      //update status payment
      let updateBooking = await bookingModel.updateStatusBooking(booking_id)
      if(!updateBooking.affectedRows) {return responseStandard(res, 'Internal server error, status booking failed to update', {}, 500, false)}


      //create ticket
      let delArr = ['price','status', 'booking_code', 'id']
      let displayTicket = []
      let ticketData = bookingData.map(item => {
        let ticket_code = uuidv1()
        Object.assign(item, {ticket_code})
        delArr.forEach(props => delete item[props])
        displayTicket.push(item)
        item = Object.values(item)
        return item
      })
      let createTicket = await ticketModel.createTicket([ticketData])

      console.log(createTicket)

      return responseStandard(res, 'Payment successfull! Ticket is issued', {ticket: displayTicket}, 500, false)
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message,{}, 500, false)
    }
  }
}