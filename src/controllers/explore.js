const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const pagination = require('../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const {
  getPopularCity,
  countPopularCity
} = require('../models/explore')

module.exports = {
  getPopularCity: async (req, res) => {
    const path = 'explore'
    try {
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await getPopularCity(limiter)
      const [{count}] = await countPopularCity() || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of popular city', {...result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (error) {
      
    }
  }
}