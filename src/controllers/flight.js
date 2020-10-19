const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const pagination = require('../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const {
  getFlight,
  getFlightCount
} = require('../models/flight')

module.exports = {
  getFlight: async (req, res) => {
    const path = 'flight'
    let {origin, destination, departure_date} = req.query
    origin=Number(origin)
    destination=Number(destination)
    const {page,limit,limiter} = pagination.pagePrep(req.query)
    try {
      const result = await getFlight(origin, destination, departure_date, limiter)
      const [{count}] = await getFlightCount(origin, destination, departure_date) || 0
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