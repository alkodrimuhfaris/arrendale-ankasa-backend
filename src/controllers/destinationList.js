const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const destinationModel = require('../models/destinationList')


module.exports = {
    getDestinationById: async (req, res) => {
        let { id } = req.params
        const data = await destinationModel.getDestinationByConditions({ id })
        if(data.length > 0) {
            return responseStandard(res, `Destination with Id ${id}`, {data})
        } else {
            return responseStandard(res, 'Destination Not found', {}, 401, false)
        }
    },
    getDestination: async (req, res) => {
        const data = await destinationModel.getDestination()
        if (data.length) {
            return responseStandard(res, `List of Destination`, {data})
        } else {
            return responseStandard(res, `Nothing found here`, {data}, 500, false)
        }
    },
    updateDestination: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        const schema = joi.object({
            name: joi.string(),
            nation: joi.string(),
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let data = await destinationModel.updateDestination(results, id)

            if (data.affectedRows) {
                return responseStandard(res, `Destination Has been Updated`, {results}, 200, true)
            } else {
                return responseStandard(res, 'Error to update Destination', {}, 500, false)
            }
        }
    },
    createDestination: async (req, res) => {
        const schema = joi.object({
            name: joi.string().required(),
            nation: joi.string().required(),
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let { name, nation } = results
            const check = await destinationModel.countDestination([name, nation])
            if (check === 0) {

                let data = await destinationModel.createDestination(results)

                if (data.affectedRows) {
                    return responseStandard(res, `Destination Has been Created`, {results}, 200, true)
                } else {
                    return responseStandard(res, 'Error to create Destination', {}, 500, false)
                }
            }
            else {
                return responseStandard(res, `Destination Already Exist`, {}, 500, false)
            }
        }
    }
}