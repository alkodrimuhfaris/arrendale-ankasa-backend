const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const classFlightModel = require('../models/classFlight')


module.exports = {
    getClassFlightById: async (req, res) => {
        let { id } = req.params
        try {
            const data = await classFlightModel.getClassFlightByConditions({ id })
            if(data.length > 0) {
                return responseStandard(res, `ClassFlight with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'ClassFlight Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getClassFlight: async (req, res) => {
        const data = await classFlightModel.getClassFlight()
        try {
            if (data.length) {
                return responseStandard(res, `List of ClassFlight`, {data})
            } else {
                return responseStandard(res, `Nothing found here`, {data}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateClassFlight: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        const schema = joi.object({
            name: joi.string(),
            price: joi.number(),
            total_seat: joi.number()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            try {
                let data = await classFlightModel.updateClassFlight(results, id)

                if (data.affectedRows) {
                    return responseStandard(res, `ClassFlight Has been Updated`, {results}, 200, true)
                } else {
                    return responseStandard(res, 'Error to update ClassFlight', {}, 500, false)
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    createClassFlight: async (req, res) => {
        const schema = joi.object({
            name: joi.string().required(),
            price: joi.number().required(),
            total_seat: joi.number().required()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let { name, nation } = results
            try {
                let data = await classFlightModel.createClassFlight(results)

                if (data.affectedRows) {
                    return responseStandard(res, `ClassFlight Has been Created`, {results}, 200, true)
                } else {
                    return responseStandard(res, 'Error to create ClassFlight', {}, 500, false)
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    deleteClassFlight: async (req, res) => {
        const { id } = req.params
        let class_id  = Number(id)
        // console.log(uid)
        try {
            const data = await classFlightModel.deleteClassFlight({id: class_id})
            if(data.affectedRows){
                return responseStandard(res, `ClassFlight Has been deleted`, {})
            } else {
                return responseStandard(res, 'ClassFlight Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}