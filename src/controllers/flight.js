const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const pagination = require('../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const flight = require('../models/flight')

module.exports = {
  getFlightSearch: async (req, res) => {
    const path = 'flight'
    let {origin, 
      destination, 
      departure_date, 
      className,
      departTmeArr=[null,null,null,null],
      arrivedTimeArr=[null,null,null,null],
      facilites = {},
      airlines = [],
      lowestPrice = 0,
      highestPrice = 1000000,
      transit = []} = req.query

      const {page,limit,limiter} = pagination.pagePrep(req.query)
   
      let data = {
        origin:Number(origin),
        destination:Number(destination),
        departure_date,
        limiter,
        className,
        departTmeArr,
        arrivedTimeArr,
        facilites,
        airlines,
        lowestPrice:Number(lowestPrice),
        highestPrice:Number(highestPrice),
        transit
      }
    try {
      let result = await flight.getFlightSearch(data)
      let {origin, destination} = result[0]
      let [{city_name:origin_city_name, 
        country_code:origin_city_country}] = await cityModel.getCityCountry(origin)
      let [{city_name:destination_city_name, 
        country_code:destination_city_country}] = await cityModel.getCityCountry(destination)
      result = result.map(item => {
        Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
      })
      const [{count}] = await flight.getFlightCount(data) || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of Flight', {...{data: result}, ...{pageInfo}})
      } else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no flight', pageInfo)
      }
    } catch (err) {
      console.log(err)
      return responseStandard(res, err.message, {}, 500, false)
    }
  },
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
      arrived_time: joi.string(),
    })
    var { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', {error: error.message}, 400, false)
    } else {
      try {
        let data = await flightModel.updateFlight(results, id)

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