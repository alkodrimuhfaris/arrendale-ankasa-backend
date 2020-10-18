const multer = require('multer')
const uploadHelper = require('../helpers/uploadHelper')
const bcrypt = require('bcrypt')
const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const detailFlightModel = require('../models/flightDetail')


module.exports = {
    getDetailFlightById: async (req, res) => {
        let { id } = req.params
        const data = await detailFlightModel.getDetailFlightByConditions({ id })
        if(data.length > 0) {
            return responseStandard(res, `Detail flight with Id ${id}`, {data})
        } else {
            return responseStandard(res, 'Detail flight Not found', {}, 401, false)
        }
    },
    getDetailFlight: async (req, res) => {
        const data = await detailFlightModel.getDetailFlight()
        if (data.length) {
            return responseStandard(res, `List of Detail flight`, {data})
        } else {
            return responseStandard(res, `Nothing found here`, {data}, 500, false)
        }
    },
    updateDetailFlight: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        const schema = joi.object({
            flight_id: joi.number(),
            flight_departure_date: joi.string(),
            price: joi.string(),
            available_seats: joi.string(),
            facilities: joi.string(),
            transits: joi.string()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let data = await detailFlightModel.updateDetailFlight(results, id)

            if (data.affectedRows) {
                return responseStandard(res, `Detail flight Has been Updated`, {results}, 200, true)
            } else {
                return responseStandard(res, 'Error to update Detail flight', {}, 500, false)
            }
        }
    },
    createDetailFlight: async (req, res) => {
        const schema = joi.object({
            flight_id: joi.number(),
            flight_departure_date: joi.string(),
            price: joi.string(),
            available_seats: joi.string(),
            facilities: joi.string(),
            transits: joi.string()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let data = await detailFlightModel.createDetailFlight(results)

            if (data.affectedRows) {
                return responseStandard(res, `Detail flight Has been Created`, {results}, 200, true)
            } else {
                return responseStandard(res, 'Error to create Detail flight', {}, 500, false)
            }
        }
    }
}