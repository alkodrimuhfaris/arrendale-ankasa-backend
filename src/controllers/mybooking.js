const mybookingModel = require('../models/mybooking')
const cpAndPassangerModel = require('../models/cpAndPassanger')
const flightModel = require('../models/flight')
const paymentModel = require('../models/payment')
const ticketModel = require('../models/ticket')
const recieptModel = require('../models/reciept')
const codeGen = require('../helpers/codeGen')
const responseStandard = require('../helpers/responseStandard')

const joi = require('joi')

module.exports = {
  getBooking: async (req, res) => {
    let { id:user_id } = req.query
    user_id = Number(user_id)
    if (user_id) {
      try{
        const data = await mybookingModel.getBooking({user_id})
        if(data.length) {
            return responseStandard(res, `Booking from id: ${user_id}`, {...data})
        } else {
            return responseStandard(res, 'There is no booking', {})
        }
      } catch (error) {
        return responseStandard(res, 'Internal server Error', {}, 500, false)
      }
    } else {
      return responseStandard(res, 'Forbidden Access!', {}, 400, false)
    }
  },
  getBookingById: async (req, res) => {
    let {id:user_id} =  req.query
    user_id = Number(user_id)
    let {booking_id} = req.params
    booking_id = Number(booking_id)
    if (user_id){
      try {
        const data = await mybookingModel.getBookingById(booking_id)
        if(data.length) {
          return responseStandard(res, `Detail booking from id: ${id}`, {...data})
        } else {
          return responseStandard(res, 'Your booking is waiting for payment', {})
        }
      } catch (error) {
        return responseStandard(res, 'Internal server Error', {}, 500, false)
      }
    } else {
      return responseStandard(res, 'Forbidden Access!', {}, 400, false)
    }
  },
  createCP: async (req,res) => {
    let {user_id} = req.query
    user_id = Number(user_id)
    console.log(user_id)
    if (!user_id) {return responseStandard(res, 'Forbidden Access!', {}, 400, false)}
    const schemaCP = joi.object({
      full_name: joi.string(),
      email: joi.string(),
      phone_number: joi.string()
    })
    let { value: cpDetail, error } = schemaCP.validate(req.body)
    if (error) {return responseStandard(res, error.message, {error: error.message}, 400, false)}
    const cpInsert = await cpAndPassangerModel.createCP(cpDetail)
    if(cpInsert.insertId){
      return responseStandard(res, `contact person inserted!`, {data: {...cpDetail, id: cpInsert.insertId }})
    } else {
      return responseStandard(res, 'Internal server Error', {}, 500, false)
    }
  },
  createPassanger: async (req,res) => {
    let {user_id} = req.query
    user_id = Number(user_id)
    console.log(user_id)
    if (!user_id) {return responseStandard(res, 'Forbidden Access!', {}, 400, false)}
    const schemaPassanger = joi.object({
      full_name: joi.string(),
      title: joi.string(),
      nationality: joi.string()
    })
    let { value: passangerDetail, err } = schemaPassanger.validate(req.body)
    if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
    const passangerInsert = await cpAndPassangerModel.createPassanger(passangerDetail)
    if(passangerInsert.insertId){
      return responseStandard(res, `passanger inserted!`, {data: {...passangerDetail, id: passangerInsert.insertId }})
    } else {
      return responseStandard(res, 'Internal server Error', {}, 500, false)
    }
  },
  createBooking: async (req, res) => {
    //get user id from header
    let {user_id} = req.query
    user_id = Number(user_id)
    console.log(user_id)

    //extract data from body
    let {
        flight_detail_id, 
        cpId,
        passangerId,
        insurance,
        full_name_cp,
        email,
        phone_number,
        full_name_passanger,
        title,
        nationality,
        payment_method,
      } = req.body
    
    //collect data for validate booking
    let bookingSchema = {
      flight_detail_id,
      insurance,
      payment_method
    }

    //collect data for contact person data
    let cpData = {full_name:full_name_cp,
                  email,
                  phone_number,
                  user_id}
    
    //collect data for passanger data
    let passangerData = {full_name: full_name_passanger,
                        title,
                        nationality,
                        user_id}
    
    //joi validate booking schema
    const schemaBooking = joi.object({
      flight_detail_id: joi.number().required(),
      insurance: joi.boolean().required(),
      payment_method: joi.string().required()
    })
    let { value: bookingDetail, error } = schemaBooking.validate(bookingSchema)
    if (error) {return responseStandard(res, error.message, {error: error.message}, 400, false)}

    //destructure bookingDetail
    ({flight_detail_id, insurance, payment_method} = bookingDetail)
    
    
    //response for forbidden access
    if (!user_id) {return responseStandard(res, 'Forbidden Access!', {}, 400, false)}

    try {
      let passangerInsert = {}
      let passangerDetail = {}
      
      //create new contact person
      if (!Number(cpId)) {
        const schemaCP = joi.object({
          full_name: joi.string(),
          email: joi.string().email(),
          phone_number: joi.number(),
          user_id: joi.number()
        })
        let { value, error } = schemaCP.validate(cpData)
        cpDetail = {...value}
        if (error) {return responseStandard(res, error.message, {error: error.message}, 400, false)}
        cpInsert = await cpAndPassangerModel.createCP(cpDetail)
      }
      
      //create new passanger to database
      if(!Number(passangerId)){
        const schemaPassanger = joi.object({
          full_name: joi.string(),
          title: joi.string(),
          nationality: joi.string(),
          user_id: joi.number()
        })
        let { value, err } = schemaPassanger.validate(passangerData)
        passangerDetail = {...value}
        if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
        passangerInsert = await cpAndPassangerModel.createPassanger(passangerDetail)
        Object.assign(passangerDetail, {id: passangerInsert.insertId})
      } else {
        [passangerDetail] = await cpAndPassangerModel.getPassangerbyId(Number(passangerId))
      }
      
      //get data passanger
      console.log(passangerDetail)
      let {title, full_name} = passangerDetail

      //extract data from flight detail
      let [{
            airlines_name,
            airlines_logo,
            flight_code,
            origin,
            class_name, 
            departure_time,
            destination,
            arrived_time,
            price
          }] = await flightModel.getFlightByDetail(flight_detail_id)
      
      //get price (with insurance or not)
      price = insurance ? price + 2 : price
      
      //declare status
      let status = false
      let message = ''

      console.log(payment_method)
      if (payment_method === 'ankasa_payment'){
        //get user balance and
        let [{balance}] = await paymentModel.getUserBalance(user_id)
  
        //checking the balance
        if (balance>price) {
          balance = balance - price
          await paymentModel.deductBalance([balance, user_id])
          status = true
        } else {
          message = 'Your balance is not enough! Ticket is booked waiting for payment'
        }
      }

      //booking data collector
      let bookingData = {
        user_id,
        airlines_name,
        airlines_logo,
        flight_code,
        class_name,
        origin,
        departure_time,
        destination,
        arrived_time,
        passanger_title:title,
        passanger_full_name:full_name,
        insurance,
        price,
        status
      }

      //asign booking
      const assignBook = await mybookingModel.createBooking(bookingData)

      if(assignBook.insertId) {
        if(status){
          let ticket_code = codeGen.ticketGen(user_id, assignBook.insertId)
          let ticketData = {...bookingData, booking_id: assignBook.insertId, ticket_code:ticket_code}
          let delArr = ['price','status']
          delArr.forEach(props => delete ticketData[props])
          //create ticket
          const assignTicket = await ticketModel.createTicket(ticketData)
          if (assignTicket.insertId){
            //data for reciept
            let recieptData = {
              user_id,
              ticket_id: assignTicket.insertId,
              price,
              payment_method: 'ankasa_payment',
              flight_code
            }
            
            //create reciept
            const createReciept = await recieptModel.createReciept(recieptData)

            //create result response
            let result = {
              bookingData: {id:assignBook.insertId, ...bookingData }, 
              ticketData: {id:assignTicket.insertId, ...ticketData},
              recieptData: {id:createReciept.insertId, ...recieptData}
            }
            return responseStandard(res, 'Ticket issued, balance deducted', result)
          } else {
            return responseStandard(res, 'Your booking is created, waiting for payment', {bookingData: {id:assignBook.insertId, ...bookingData}})    
          }
        }
        message = message ? message : 'Your booking is created, waiting for payment' 
        return responseStandard(res, message, {bookingData: {id:assignBook.insertId, ...bookingData}})
      } else {
        return responseStandard(res, 'Error when creating booking', {}, 400, false)
      }
    } catch (error) {
      console.log(error)
      return responseStandard(res, 'Internal server error', {}, 500, false)
    }
  }
}