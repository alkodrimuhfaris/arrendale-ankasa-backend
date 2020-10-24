const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const detailFlightModel = require('../../models/admin/detailFlight')
const authModel = require('../../models/admin/auth')

const pagination = require('../../helpers/pagination')


module.exports = {
    getDetailFlightByFlightId: async (req, res) => {
        let { id:flight_id } = req.params
        try {
            const data = await detailFlightModel.getFlightDetailByConditions({ flight_id })
            if(data.length > 0) {
                return responseStandard(res, `detail Flight by flight id: ${id}`, {data})
            } else {
                return responseStandard(res, 'ClassFlight Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getAllDetailFlight: async (req, res) => {
        try{
            const {page,limit,limiter} = pagination.pagePrep(req.query)
            const data = await detailFlightModel.getFlightDetailByConditions({ flight_id }, limiter)
            const [{count}] = await detailFlightModel.countFlightDetail() || 0
            if(data.length > 0) {
                const pageInfo = pagination.paging(count, page, limit, 'manage/flight/detail', req)
                return responseStandard(res, `List of ClassFlight`, {data, pageInfo})
            } else {
                return responseStandard(res, `Nothing found here`, {data}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateFlightDetail: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        try {
        
            let { id:user_id, role_id, identifier } = req.user
            if(role_id !== 1) {return responseStandard(res, `Forbidden Access!`, {}, 403, true)}

            let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
            if(adminCheck[0].user_id !== user_id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

            const schema = joi.object({
                flight_id: joi.number(),
                transit_id: joi.number(),
                class_name: joi.string(),
                price: joi.number(),
                seat_count: joi.number()
            })
            const { value: results, error } = schema.validate(req.body)
            if (error) {
                return responseStandard(res, 'Error', {error: error.message}, 400, false)
            } else {
                let data = await detailFlightModel.updateFlightDetail(results, {id})
                if (data.affectedRows) {
                    return responseStandard(res, `ClassFlight Has been Updated`, {results}, 200, true)
                } else {
                    return responseStandard(res, 'Error to update ClassFlight', {}, 500, false)
                }
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    createFlightDetail: async (req, res) => {
        try {
            let { id:user_id, role_id, identifier } = req.user
            if(role_id !== 1) {return responseStandard(res, `Forbidden Access!`, {}, 403, true)}

            let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
            if(adminCheck[0].user_id !== user_id) {return responseStandard(res, 'Forbidden Access!', {}, 403, false)}
            

            const schema = joi.object({
                flight_id: joi.number().required(),
                transit_id: joi.number().required(),
                class_name: joi.string().required(),
                price: joi.number().required(),
                seat_count: joi.number().required()
            })
            let { value: results, error } = schema.validate(req.body)
            if (error) {
                return responseStandard(res, 'Error', {error: error.message}, 400, false)
            } else {
                let data = await detailFlightModel.createFlightDetail(results)
                if (data.insertId) {
                    let results = {id:data.insertId, ...results}
                    return responseStandard(res, `Detail Flight Has been Created`, {results, id:data.insertId}, 200, true)
                } else {
                    return responseStandard(res, 'Error to create Detail Flight', {}, 500, false)
                }
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    deleteFlightDetail: async (req, res) => {
        try {
            let { id:user_id, role_id, identifier } = req.user
            if(role_id !== 1) {return responseStandard(res, `Forbidden Access!`, {}, 403, true)}

            let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
            if(adminCheck[0].user_id !== user_id) {return responseStandard(res, 'Forbidden Access!', {}, 403, false)}

            const data = await detailFlightModel.deleteFlightDetail({id: class_id})
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