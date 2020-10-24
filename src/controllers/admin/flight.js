<<<<<<< HEAD:src/controllers/flight.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const pagination = require('../helpers/pagination')
const flightModel = require('../models/flight')
const joi = require('joi')

=======
const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')

const flightModel = require('../../models/admin/flight')
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/flight.js

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const flight = require('../models/flight')
const city = require('../models/city')

module.exports = {
<<<<<<< HEAD:src/controllers/flight.js
  getFlightById: async (req, res) => {
      let { id } = req.params
      try {
          const data = await flightModel.getFlightByConditions({ id })
          if(data.length > 0) {
              return responseStandard(res, `Flight with Id ${id}`, {data})
          } else {
              return responseStandard(res, 'Flight Not found', {}, 401, false)
          }
      } catch (e) {
          return responseStandard(res, e.message, {}, 401, false)
      }
  },
  getFlight: async (req, res) => {
    try {
      const data = await flightModel.getFlight()
      if (data.length) {
          return responseStandard(res, `List of Flight`, {data})
      } else {
          return responseStandard(res, `Nothing found here`, {data}, 500, false)
      }
    } catch (e) {
      return responseStandard(res, e.message, {}, 401, false)
    }
  },
  updateFlight: async (req, res) => {
    let { id } = req.params
    id = Number(id)
    const schema = joi.object({
      airline_id: joi.number(),
      class_id: joi.number(),
      origin: joi.string(),
      destination: joi.string(),
      transit_id: joi.number(),
      departure_date: joi.string(),
      departure_time: joi.string(),
      arrived_date: joi.string(),
      arrived_time: joi.string()
    })
    var { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', {error: error.message}, 400, false)
    } else {
      try {
        let data = await flightModel.updateFlight(results, id)
=======
    createFlight: async (req, res) => {
        const schema = joi.object({
          airlines_id: joi.number().required(),
          flight_code: joi.string().required(),
          origin: joi.string().required(),
          departure_date: joi.string().required(),            
          departure_time: joi.string().required(),
          destination: joi.number().required(),
          arrived_date: joi.string().required(),
          arrived_time: joi.string().required()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let { name, departure_time } = results
            try {
                let check = await flightModel.countFlight(departure_time)
                if (check > 0) {
                    return responseStandard(res, 'Airline Already Exist', {}, 401, false)
                } else {
                    let data = await flightModel.createFlight(results)
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/flight.js

        if (data.affectedRows) {
          return responseStandard(res, `Flight Has been Updated`, {results}, 200, true)
        } else {
          return responseStandard(res, 'Error to update Flight', {}, 500, false)
        }
      } catch (e) {
        return responseStandard(res, e.message, {}, 401, false)
      }
    }
    },
    createFlight: async (req, res) => {
      const schema = joi.object({
        airline_id: joi.number().required(),
        class_id: joi.number().required(),
        origin: joi.string().required(),
        destination: joi.string().required(),
        transit_id: joi.number().required(),
        departure_date: joi.string().required(),
        departure_time: joi.string().required(),
        arrived_date: joi.string().required(),
        arrived_time: joi.string().required()
      })
      var { value: results, error } = schema.validate(req.body)
      if (error) {
        return responseStandard(res, 'Error', {error: error.message}, 400, false)
      } else {
      let { name, departure_time } = results
        try {
          let check = await flightModel.countFlight(departure_time)
          if (check > 0) {
            return responseStandard(res, 'Airline Already Exist', {}, 401, false)
          } else {
            let data = await flightModel.createFlight(results)

            if (data.affectedRows) {
              return responseStandard(res, `Flight Has been Created`, {results}, 200, true)
            } else {
              return responseStandard(res, 'Error to create Flight', {}, 500, false)
            }
          }
        } catch (e) {
          return responseStandard(res, e.message, {}, 401, false)
        }
      }
    },
<<<<<<< HEAD:src/controllers/flight.js
=======
    updateFlight: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        const schema = joi.object({
            airlines_id: joi.number(),
            flight_code: joi.string(),
            origin: joi.string(),
            departure_date: joi.string(),            
            departure_time: joi.string(),
            destination: joi.number(),
            arrived_date: joi.string(),
            arrived_time: joi.string()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            try {
                if (results.length) {
                  let data = await flightModel.updateFlight(results, id)

                  if (data.affectedRows) {
                      return responseStandard(res, `Flight Has been Updated`, {results}, 200, true)
                  } else {
                      return responseStandard(res, 'Error to update Flight', {}, 500, false)
                  }
                } else {
                  return responseStandard(res, 'U must fill atleast one column', {}, 401, false)
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 500, false)
            }
        }
    }, 
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/flight.js
    deleteFlight: async (req, res) => {
      const { id } = req.params
      let flight_id  = Number(id)
      // console.log(uid)
      try {
        const data = await flightModel.deleteFlight({id: flight_id})
        if(data.affectedRows){
            return responseStandard(res, `Flight Has been deleted`, {})
        } else {
            return responseStandard(res, 'Flight Not found', {}, 401, false)
        }
      } catch (e) {
        return responseStandard(res, e.message, {}, 401, false)
      }
    }
}