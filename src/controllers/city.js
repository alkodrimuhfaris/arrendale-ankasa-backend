const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const responseStandard = require('../helpers/responseStandard')
const pagination = require('../helpers/pagination')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const cityModel = require('../models/city')

module.exports = {
  getPopularCity: async (req, res) => {
    const path = 'explore/popular'
    try {
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await cityModel.getPopularCity(limiter)
      const [{count}] = await cityModel.countPopularCity() || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of popular city', {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (error) {
      return responseStandard(res, error.message, {}, 500, false)
    }
  },
  getMostVisitedCity: async (req, res) => {
    const path= 'explore/trending'
    try {
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      const result = await cityModel.getTrendingCity(limiter)
      const [{count}] = await cityModel.getTrendingCityCount() || 0
      if (result.length) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'List of trending city', {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no item in the list')
      }
    } catch (err) {
      return responseStandard(res, err.message, {}, 500, false)
    }
  },
  searchCity: async (req, res) => {
    try{
      const {city_name} = req.body
      const result = await cityModel.getCityIdLike(city_name)
      if (result.length) {
        return responseStandard(res, 'List of city', {result, pageInfo})
      }
      else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'There is no city in the list')
      }
    } catch (er) {
      console.log(er)
      return responseStandard(res, err.message, {}, 500, false)
    }
  },
  createCity: async (req, res) => {
    const schema = joi.object({
      city_name: joi.string().required(),
      country_code: joi.string().required(),
      country_name: joi.string().required(),
      city_picture: joi.string().required(),
      rating: joi.string().required()
    })
    var { value: results, error } = schema.validate(req.body)
    if (error) {
        return responseStandard(res, 'Error', {error: error.message}, 400, false)
    } else {
        try {
            let data = await cityModel.createCity(result)
            if (data.length) {
                Object.assign(result, {id: data.insertId})
                return responseStandard(res, `City Has been Created`, {results}, 200, true)
            } else {
                return responseStandard(res, 'Error to create ClassFlight', {}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    }
  },
  updateCity: async (req, res) => {
    const {id:city_id} = req.params
    const schema = joi.object({
      city_name: joi.string(),
      country_code: joi.string(),
      country_name: joi.string(),
      city_picture: joi.string(),
      rating: joi.string()
    })
    var { value: results, error } = schema.validate(req.body)
    if (error) {
        return responseStandard(res, 'Error', {error: error.message}, 400, false)
    } else {
        try {
            let data = await cityModel.createCity(result)
            if (data.length) {
                Object.assign(result, {id: data.insertId})
                return responseStandard(res, `City Has been Created`, {results}, 200, true)
            } else {
                return responseStandard(res, 'Error to create ClassFlight', {}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    }
  }
}