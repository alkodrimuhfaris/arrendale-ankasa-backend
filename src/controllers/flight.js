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
  getFlight: async (req, res) => {
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
        origin=Number(origin),
        destination=Number(destination),
        departure_date,
        limiter,
        className,
        departTmeArr,
        arrivedTimeArr,
        facilites,
        airlines,
        lowestPrice=Number(lowestPrice),
        highestPrice=Number(highestPrice),
        transit
      }
    try {
      const result = await flight.getFlight(data)
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
  }
}