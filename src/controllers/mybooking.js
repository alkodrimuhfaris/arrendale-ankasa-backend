const mybookingModel = require('../models/mybooking')
const cpAndPassanger = require('../models/cpAndPassanger')
const flight = require('../models/flight')
const payment = require('../models/payment')
const reciept = require('../models/reciept')
const codeGen = require('../helpers/codeGen')
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
    let {id:user_id} = req.query
    user_id = Number(user_id)
    if (!user_id) {return responseStandard(res, 'Forbidden Access!', {}, 400, false)}
    const schemaCP = joi.object({
      full_name: joi.string(),
      email: joi.string(),
      phone_number: joi.string()
    })
    let { value: cpDetail, error } = schemaCP.validate(req.body)
    if (error) {return responseStandard(res, error.message, {error: error.message}, 400, false)}
    const cpInsert = await cpAndPassanger.createCP(cpDetail)
    if(cpInsert.insertId){
      return responseStandard(res, `contact person inserted!`, {data: {...cpDetail, id: cpInsert.insertId }})
    } else {
      return responseStandard(res, 'Internal server Error', {}, 500, false)
    }
  },
  createPassanger: async (req,res) => {
    let {id:user_id} = req.query
    user_id = Number(user_id)
    if (!user_id) {return responseStandard(res, 'Forbidden Access!', {}, 400, false)}
    const schemaPassanger = joi.object({
      full_name: joi.string(),
      title: joi.string(),
      nationality: joi.string()
    })
    let { value: passangerDetail, err } = schemaPassanger.validate(req.body)
    if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
    const passangerInsert = await cpAndPassanger.createPassanger(passangerDetail)
    if(passangerInsert.insertId){
      return responseStandard(res, `passanger inserted!`, {data: {...passangerDetail, id: passangerInsert.insertId }})
    } else {
      return responseStandard(res, 'Internal server Error', {}, 500, false)
    }
  },
  createBooking: async (req, res) => {
    //get user id from header
    let {id:user_id} = req.query
    user_id = Number(user_id)

    //extract data from body
    let {flight_detail_id, 
        cpId,
        passangerId,
        insurance,
        full_name_cp,
        email,
        phone_number,
        full_name_passanger,
        title,
        nationality,
        payment_method='angkasa_payment'
      } = req.body

    //collect data for contact person data
    let cpData = {full_name:full_name_cp,
                  email,
                  phone_number}
    
    //collect data for passanger data
    let passangerData = {full_name: full_name_passanger,
                        title,
                        nationality}
    
    //insurance conditioner
    insurance = insurance && Number(insurance)

    //flight detail id conditioner
    flight_detail_id = Number(flight_detail_id)
    
    //response for forbidden access
    if (!user_id) {return responseStandard(res, 'Forbidden Access!', {}, 400, false)}

    try {
      let passangerInsert = {}
      let passangerDetail = {}
      
      //create new contact person
      if (!Number(cpId)) {
        const schemaCP = joi.object({
          full_name: joi.string(),
          email: joi.string(),
          phone_number: joi.string()
        })
        let { value: cpDetail, error } = schemaCP.validate(cpData)
        if (error) {return responseStandard(res, error.message, {error: error.message}, 400, false)}
        cpInsert = await cpAndPassanger.createCP(cpDetail)
      }
      
      //create new passanger to database
      if(!Number(passangerId)){
        const schemaPassanger = joi.object({
          full_name: joi.string(),
          title: joi.string(),
          nationality: joi.string()
        })
        let { value: passangerDetail, err } = schemaPassanger.validate(passangerData)
        if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
        passangerInsert = await cpAndPassanger.createPassanger(passangerDetail)
        Object.assign(passangerDetail, {id: passangerInsert.insertId})
      } else {
        [passangerDetail] = await cpAndPassanger.getPassangerbyId(Number(passangerId))
      }
      
      //get data passanger
      let {title, full_name} = passangerDetail

      //extract data from flight detail
      let [{
            airlines_name,
            airlines_logo,
            airlines_code,
            origin, 
            departure_time,
            destination,
            arrived_time,
            price
          }] = await flight.getFlightDetail(flight_detail_id)
      
      //get price (with insurance or not)
      price = insurance ? price + 2 : price
      
      //declare status
      let status = false

      if (payment_method === 'ankasa_payment'){
        //get user balance and
        let [{balance}] = await payment.getUserBalance(user_id)
  
        //checking the balance
        if (balance<price) {
          balance = balance - price
          status = true
          await payment.deductBalance([{balance}, {status}])
        }
      }

      //booking data collector
      let bookingData = {
        user_id,
        airlines_name,
        airlines_logo,
        airlines_code,
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

          //create ticket
          const assignTicket = await mybookingModel.createTicket(ticketData)
          if (assignTicket.insertId){
            //data for reciept
            let recieptData = {
              user_id,
              ticket_id: assignTicket.insertId,
              price,
              payment_method: 'ankasa_payment'
            }
            
            //create reciept
            const createReciept = await reciept.createReciept(recieptData)

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
        return responseStandard(res, 'Your booking is created, waiting for payment', {bookingData: {id:assignBook.insertId, ...bookingData}})
      } else {
        return responseStandard(res, 'Error when creating booking', {}, 400, false)
      }
    } catch (error) {
      return responseStandard(res, 'Internal server error', {}, 500, false)
    }
  }
}