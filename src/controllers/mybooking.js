const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {v4:uuidv4} = require('uuid')

const mybookingModel = require('../models/mybooking')
const cpAndPassangerModel = require('../models/cpAndPassanger')
const flightModel = require('../models/flightToBooking')
const paymentModel = require('../models/payment')
const ticketModel = require('../models/ticket')
const recieptModel = require('../models/reciept')
const codeGen = require('../helpers/codeGen')
const cityModel = require('../models/city')
const responseStandard = require('../helpers/responseStandard')

const pagination = require('../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))


const joi = require('joi')

module.exports = {
  getBooking: async (req, res) => {
    
    let { id:user_id } = req.user
    user_id = Number(user_id)

    if (user_id) {
      try{
        const {page,limit,limiter} = pagination.pagePrep(req.query)
        const data = await mybookingModel.getBooking({user_id}, limiter)
        const [{count}] = await mybookingModel.getBookingCount({user_id}) || 0
        if(data.length) {
          const pageInfo = pagination.paging(count, page, limit, 'mybook', req)
          return responseStandard(res, `Booking from id: ${user_id}`, {data, pageInfo})
        } else {
          const pageInfo = pagination.paging(count, page, limit, 'mybook', req)
          return responseStandard(res, 'There is no booking list', {pageInfo})
        }
      } catch (error) {
        return responseStandard(res, 'Internal server Error', {}, 500, false)
      }
    } else {
      return responseStandard(res, 'Forbidden Access!', {}, 400, false)
    }
  },
  getBookingById: async (req, res) => {
    let {id:user_id} =  req.user
    user_id = Number(user_id)

    let {id:booking_id} = req.params
    booking_id = Number(booking_id)
    if (user_id){
      try {
        let data = await mybookingModel.getBookingById(booking_id)
        let detailBooking = await mybookingModel.getBookingDetail(booking_id)
        if(data.length) {
          ([data] = data)
          return responseStandard(res, `Detail booking from id: ${booking_id}`, {data, detailBooking: detailBooking}, )
        } else {
          return responseStandard(res, 'You have not book a trip yet, come fly with us book one', {})
        }
      } catch (error) {
        console.log(error)
        return responseStandard(res, 'Internal server Error', {}, 500, false)
      }
    } else {
      return responseStandard(res, 'Forbidden Access!', {}, 400, false)
    }
  },
  createCP: async (req,res) => {
    let {id:user_id} = req.user
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
    let {id:user_id} = req.user
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
    let {id:user_id} = req.user
    user_id = Number(user_id)
    console.log(user_id)

    //extract data from body
    let {
        flight_detail_id,
        quantity, 
        cpId,
        passangerArray,
        insurance,
        full_name_cp,
        email,
        phone_number,
        payment_method
      } = req.body
      
    quantity = Number(quantity)

    if(quantity !== passangerArray.length) {return responseStandard(res, 'Number of passanger should be equal to quantity!', {}, 400, false)}
    
    console.log('passanger array')
    console.log(passangerArray)

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
      let passangerDetail = []


      //validating array passanger id
      if(!Number(cpId)){
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

      for (let item of passangerArray) {
        Object.assign(item, {user_id})
        if (!Number(item.passangerId)) {
          delete item.passangerId
          const schemaPassanger = joi.object({
            full_name: joi.string(),
            title: joi.string(),
            nationality: joi.string(),
            user_id: joi.number()
          })
          let { value, err } = schemaPassanger.validate(item)
          if (err) {return responseStandard(res, err.message, {error: error.message}, 400, false)}
          item = {...value}
          passangerInsert = await cpAndPassangerModel.createPassanger(item)
          Object.assign(item, {id: passangerInsert.insertId})
          passangerDetail.push(item)
        } else {
          [item] = await cpAndPassangerModel.getPassangerbyId(Number(item.passangerId))
          passangerDetail.push(item)
        }
      }

      //get data passanger
      console.log(passangerDetail)

      //extract data from flight detail
      let [{
            airlines_name,
            airlines_logo,
            flight_code,
            origin,
            class_name,
            departure_date, 
            departure_time,
            destination,
            arrived_date,
            arrived_time,
            luggage,
            in_flight_meal,
            wifi,
            price
          }] = await flightModel.getFlightByDetail(flight_detail_id)
      
      let [{city_name:origin_city_name, 
            country_code:origin_city_country}] = await cityModel.getCityCountry(origin)
      let [{city_name:destination_city_name, 
            country_code:destination_city_country}] = await cityModel.getCityCountry(destination)

      //get price (with insurance or not)
      price = price*quantity
      let insurancePrice = insurance ? 2 * quantity : 0
      
      //declare status
      let status = false
      let message = ''

      console.log(payment_method)
      if (payment_method === 'ankasa payment'){
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

      //booking code
      let booking_code = codeGen.bookingGen(user_id)

      //booking data collector
      let bookingData = {
        user_id,
        booking_code,
        airlines_name,
        airlines_logo,
        flight_code,
        class_name,
        origin,
        origin_city_name,
        origin_city_country,
        departure_date,
        departure_time,
        destination,
        destination_city_name,
        destination_city_country,
        arrived_date,
        arrived_time,
        insurance,
        price: price + insurancePrice,
        status,
        luggage,
        in_flight_meal,
        wifi        
      }

      //asign booking
      const assignBook = await mybookingModel.createBooking(bookingData)

      let passangerBooking = []
      passangerDetail.forEach(item => {
        item = [assignBook.insertId, item.title, item.full_name, item.nationality]
        passangerBooking.push(item)
      })

      console.log('passangerBooking')
      console.log(passangerBooking)

      //get seat pesawat
      let [{seat_count}] = await flightModel.getSeatCount(flight_detail_id)
      seat_count = seat_count - quantity
      if(seat_count < 0) {return responseStandard(res, 'Seat is full!', {}, 400, false)}

      await mybookingModel.createBookingDetail([passangerBooking])      
      
      if(assignBook.insertId) {
        //update seat pesawat
        await flightModel.updateFlightSeat([seat_count,flight_detail_id])

        if(status){
          let delArr = ['price','status', 'booking_code']
          let displayTicket = []

          let ticketData = [...Array(quantity)].map((item, index) => {
            let ticket_code = uuidv4()
            item = {...bookingData,
                    passanger_title: passangerDetail[index].title,
                    passanger_full_name: passangerDetail[index].full_name,
                    passanger_nationality: passangerDetail[index].nationality, 
                    booking_id: assignBook.insertId,
                    ticket_code}
            delArr.forEach(props => delete item[props])
            displayTicket.push(item)
            item = Object.values(item)
            return item
          })

          //create ticket
          const assignTicket = await ticketModel.createTicket([ticketData])

          if (assignTicket){
            //data for reciept
            let recieptData = {
              user_id,
              booking_code,
              total_price: price+insurancePrice,
              payment_method: 'ankasa_payment'
            }
            
            //create reciept
            const createReciept = await recieptModel.createReciept(recieptData)
            
            //create detail reciept
            let showRecieptDetail = {
              reciept_id:createReciept.insertId,
              transaction:'ticket flight on '+flight_code ,
              quantity,
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

            
            //create result response
            let result = {
              bookingData: {id:assignBook.insertId, ...bookingData}, 
              ticketData: displayTicket,
              recieptData: {id:createReciept.insertId, ...recieptData},
              recieptDetailData: showRecieptDetail
            }

            //add city_activity
            await cityModel.addCityActivity({city_id:origin, origin_counter:quantity})
            await cityModel.addCityActivity({city_id:destination, destination_counter:quantity})

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