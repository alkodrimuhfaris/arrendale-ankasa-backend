const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')
const uploadHelper = require('../helpers/uploadHelper')
const multer = require('multer')

const facilityModel = require('../models/facilities')


module.exports = {
    createFacility: async (req, res) => {
        uploadHelper(req, res, async function(err) {
            try {
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
                      flight_id: joi.number().required(),
                      facility_name: joi.string().required()
                  })
                  var { value: results, error } = schema.validate(req.body)
                  if (error) {
                      return responseStandard(res, 'Error', {error: error.message}, 400, false)
                  } else {
                      let { name } = results
                      const check = await facilityModel.countFacilities(name)
                      let picture = `uploads/${req.file.filename}`
                      results = {
                          ...results,
                          facility_image: picture
                      }
      
                      let data = await facilityModel.createFacilities(results)
      
                      if (data.affectedRows) {
                          return responseStandard(res, `Facility Has been Created`, {results}, 200, true)
                      } else {
                          return responseStandard(res, 'Error to create Facility', {}, 500, false)
                      }
                  }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })
    },
    getFacility: async (req, res) => {
        try {
            const data = await facilityModel.getFacilities()
            if (data.length) {
                return responseStandard(res, `List of Facility`, {data})
            } else {
                return responseStandard(res, `Nothing found here`, {data}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getFacilityById: async (req, res) => {
        let { id } = req.params
        try {
            const data = await facilityModel.getFacilitiesByConditions({ id })
            if(data.length > 0) {
                return responseStandard(res, `Facility with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'Facility Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateFacility: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        uploadHelper(req, res, async function(err) {
            try {
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
                    flight_id: joi.number(),
                    facility_name: joi.string()
                  })
                  
                  var { value: results, error } = schema.validate(req.body)
                  if (error) {
                      return responseStandard(res, 'Error', {error: error.message}, 400, false)
                  } else {
                      
                      let picture = `uploads/${req.file.filename}`
                      results = {
                          ...results,
                          facility_image: picture                          
                      }
      
                      let data = await facilityModel.updateFacilities(results, id)
      
                      if (data.affectedRows) {
                          return responseStandard(res, `Facility Has been Updated`, {results}, 200, true)
                      } else {
                          return responseStandard(res, 'Error to updates Facility', {}, 500, false)
                      }
                  }      
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })
    },    
    deleteFacility: async (req, res) => {
        const { id } = req.params
        let facility_id  = Number(id)
        // console.log(uid)
        try {
            const data = await flightModel.deleteFacilities({id: facility_id})
            if(data.affectedRows){
                return responseStandard(res, `Facility Has been deleted`, {})
            } else {
                return responseStandard(res, 'Facility Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}