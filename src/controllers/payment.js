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
const recieptModel = require('../models/reciept')

module.exports= {
  topUpBalance: async (req, res) => {
    //ganti jadi req.user nanti
    let {id:user_id} = req.user
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
    let {id} = req.user
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
      let {price, user_id, status, booking_code} = bookingData[0]

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

      if (createTicket){
        //data for reciept
        let recieptData = {
          user_id:id,
          booking_code:booking_code,
          total_price: price,
          payment_method: 'ankasa_payment'
        }
        
        //create reciept
        const createReciept = await recieptModel.createReciept(recieptData)
        Object.assign(recieptData, {id: createReciept.insertId})

        const [{quantity}] = await bookingModel.getBookingQuantity(booking_id)
        const {insurance} = bookingData[0]
        price = insurance ? price - (quantity*2) : price
        let insurancePrice = insurance ? quantity*2 : 0

        //create detail reciept
        let showRecieptDetail = {
          reciept_id:createReciept.insertId,
          transaction:'ticket flight on '+bookingData[0].flight_code ,
          quantity:quantity,
          price:price
        }

        let detailInsurance = {
          reciept_id:createReciept.insertId,
          transaction:'flight insurance' ,
          quantity,
          price:insurancePrice
        }

        let recieptDetailData = [
          [Object.values(showRecieptDetail)]
        ]
        insurance && recieptDetailData.push([Object.values(detailInsurance)])

        showRecieptDetail = insurance ? [showRecieptDetail,detailInsurance] : [showRecieptDetail]

        //create reciept detail
        await recieptModel.createRecieptDetail(recieptDetailData)

        let result = {
          ticketData: displayTicket,
          recieptData: {id:createReciept.insertId, ...recieptData},
          recieptDetailData: showRecieptDetail
        }

        
        return responseStandard(res, 'Payment successfull! Ticket is issued', {result}, 500, false)
      } else {
        balance = balance + price

        //update balance
        await payment.deductBalance([balance, id])
        return responseStandard(res, 'Create ticket unsuccesfull', {}, 500, false)
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, error.message,{}, 500, false)
    }
  }
}