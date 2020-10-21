const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const facilityModel = require('../models/facilities')


module.exports = {
    getFacilityById: async (req, res) => {
        let { id } = req.params
        const data = await facilityModel.getFacilitiesByConditions({ id })
        if(data.length > 0) {
            return responseStandard(res, `Facility with Id ${id}`, {data})
        } else {
            return responseStandard(res, 'Facility Not found', {}, 401, false)
        }
    },
    getFacility: async (req, res) => {
        const data = await facilityModel.getFacilities()
        if (data.length) {
            return responseStandard(res, `List of Facility`, {data})
        } else {
            return responseStandard(res, `Nothing found here`, {data}, 500, false)
        }
    },
    updateFacility: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        uploadHelper(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
              if(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length === 0){
                  console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length > 0)
                  return responseStandard(res, 'fieldname doesnt match', {}, 500, false)
              }
              return responseStandard(res, err.message, {}, 500, false)
            } else if (err) {
              return responseStandard(res, err.message, {}, 401, false)
            }
        
            const schema = joi.object({
                airline_id: joi.string().required(),
                name: joi.string().required(),
            })
            
            var { value: results, error } = schema.validate(req.body)
            if (error) {
                return responseStandard(res, 'Error', {error: error.message}, 400, false)
            } else {
                
                let picture = `uploads/${req.file.filename}`
                results = {
                    ...results,
                    url: picture
                }

                let data = await facilityModel.updateFacilities(results, id)

                if (data.affectedRows) {
                    return responseStandard(res, `Facility Has been Created`, {results}, 200, true)
                } else {
                    return responseStandard(res, 'Error to create Facility', {}, 500, false)
                }
            }

        })
    },
    createFacility: async (req, res) => {
        uploadHelper(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
              if(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length === 0){
                  console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.files.length > 0)
                  return responseStandard(res, 'fieldname doesnt match', {}, 500, false)
              }
              return responseStandard(res, err.message, {}, 500, false)
            } else if (err) {
              return responseStandard(res, err.message, {}, 401, false)
            }
        
            const schema = joi.object({
                airline_id: joi.string().required(),
                name: joi.string().required(),
            })
            var { value: results, error } = schema.validate(req.body)
            if (error) {
                return responseStandard(res, 'Error', {error: error.message}, 400, false)
            } else {
                let { airline_id, name } = results
                const check = await facilityModel.countFacilities([airline_id, name])
                if (check === 0) {
                    
                    let picture = `uploads/${req.file.filename}`
                    results = {
                        ...results,
                        url: picture
                    }
    
                    let data = await facilityModel.createFacility(results)
    
                    if (data.affectedRows) {
                        return responseStandard(res, `Facility Has been Created`, {results}, 200, true)
                    } else {
                        return responseStandard(res, 'Error to create Facility', {}, 500, false)
                    }
                }
                else {
                    return responseStandard(res, `Facility Already Exist`, {}, 500, false)
                }
            }

        })
    }
}