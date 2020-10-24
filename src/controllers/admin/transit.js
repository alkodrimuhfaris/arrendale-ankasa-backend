const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')

const transitModel = require('../../models/admin/transit')


module.exports = {
    getTransitById: async (req, res) => {
        let { id } = req.params
        try {
            const data = await transitModel.getTransitByConditions({ id })
            if(data.length > 0) {
                return responseStandard(res, `Transit with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'Transit Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getTransit: async (req, res) => {
        try {
            const data = await transitModel.getTransit()
            if (data.length) {
                return responseStandard(res, `List of Transit`, {data})
            } else {
                return responseStandard(res, `Nothing found here`, {data}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateTransit: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        const schema = joi.object({
            name: joi.string()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            try {
                let data = await transitModel.updateTransit(results, id)

                if (data.affectedRows) {
                    return responseStandard(res, `Transit Has been Updated`, {results}, 200, true)
                } else {
                    return responseStandard(res, 'Error to update Transit', {}, 500, false)
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    createTransit: async (req, res) => {
        const schema = joi.object({
            name: joi.string().required()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            let { name } = results
            try {
                let check = await transitModel.countTransit(name)
                if (check[0].count > 0) {
                    return responseStandard(res, 'Transit Already Exist', {}, 401, false)
                } else {
                    let data = await transitModel.createTransit(results)

                    if (data.affectedRows) {
                        return responseStandard(res, `Transit Has been Created`, {results}, 200, true)
                    } else {
                        return responseStandard(res, 'Error to create Transit', {}, 500, false)
                    }
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    deleteTransit: async (req, res) => {
        const { id } = req.params
        let tid  = Number(id)
        // console.log(uid)
        try {
            const data = await transitModel.deleteTransit({id: tid})
            if(data.affectedRows){
                return responseStandard(res, `Transit Has been deleted`, {})
            } else {
                return responseStandard(res, 'Transit Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}