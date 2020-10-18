const multer = require('multer')
const uploadHelper = require('../helpers/uploadHelper')
const bcrypt = require('bcrypt')
const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const flightModel = require('../models/flight')


module.exports = {
    getFlightById: async (req, res) => {
        let { id } = req.params
        const data = await flightModel.getFlightByConditions({ id })
        if(data.length > 0) {
            return responseStandard(res, `Flight with Id ${id}`, {data})
        } else {
            return responseStandard(res, 'Flight Not found', {}, 401, false)
        }
    },
    getFlight: async (req, res) => {
        const data = await flightModel.getFlight()
        if (data.length) {
            return responseStandard(res, `List of Flight`, {data})
        } else {
            return responseStandard(res, `Nothing found here`, {data}, 500, false)
        }
    },
    updateFlight: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        const schema = joi.object({
            airline_id: joi.number(),
            origin: joi.string(),
            destination: joi.string(),
            departure_time: joi.string(),
            arrival_time: joi.string(),
            total_seat: joi.string(),
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let data = await flightModel.updateFlight(results, id)

            if (data.affectedRows) {
                return responseStandard(res, `Flight Has been Updated`, {results}, 200, true)
            } else {
                return responseStandard(res, 'Error to update Flight', {}, 500, false)
            }
        }
    },
    createFlight: async (req, res) => {
        const schema = joi.object({
            airline_id: joi.string().required(),
            origin: joi.string().required(),
            destination: joi.string().required(),
            departure_time: joi.string().required(),
            arrival_time: joi.string().required(),
            total_seat: joi.string().required(),
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let data = await flightModel.createFlight(results)

            if (data.affectedRows) {
                return responseStandard(res, `Flight Has been Created`, {results}, 200, true)
            } else {
                return responseStandard(res, 'Error to create Flight', {}, 500, false)
            }
        }
    }
}