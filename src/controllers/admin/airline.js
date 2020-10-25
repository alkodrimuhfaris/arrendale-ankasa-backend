const multer = require('multer')
const uploadHelper = require('../../helpers/uploadHelper')
const bcrypt = require('bcrypt')
const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')

const airlineModel = require('../../models/admin/airline')


module.exports = {
    getAirlinesById: async (req, res) => {
        let { id } = req.params
        const data = await airlineModel.getAirlinesByConditions({ id })
        try {
            if(data.length > 0) {
                return responseStandard(res, `Airline with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'Airline Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getAllAirlines: async (req, res) => {
        const data = await airlineModel.getAirlines()
        try {
            if (data.length) {
                return responseStandard(res, `List of Airline`, {data})
            } else {
                return responseStandard(res, `Nothing found here`, {data}, 401, false)
            }
        }
        catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateAirlines: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        uploadHelper(req, res, async function(err) {
            try {
                if (err instanceof multer.MulterError) {
                    if(err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length === 0){
                        console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length > 0)
                        return responseStandard(res, 'fieldname doesnt match', {}, 500, false)
                    }
                    return responseStandard(res, err.message, {}, 500, false)
                  } else if (err) {
                    return responseStandard(res, err.message, {}, 401, false)
                  }  
                  const schema = joi.object({
                      name: joi.string()
                  })
                  let { value: results, error } = schema.validate(req.body)
                  if (error) {
                      return responseStandard(res, 'Error', {error: error.message}, 400, false)
                  } else {
                      
                  let { name } = results
                      if ( name || req.file ) {
                          let picture = `uploads/${req.file.filename}`
                          console.log(req.file)
                              results = {
                                  ...results,
                                  logo: picture
                              }
                          const update = await airlineModel.updateAirlinePartial({logo: picture}, id)
                          if(update.affectedRows) {
                              return responseStandard(res, `Airline Has been Updated`, {results})
                          } else {
                              return responseStandard(res, 'Airline Not found', {}, 401, false)
                          }
                      } else {
                          return responseStandard(res, 'At least fill one column!', '', 400, false)
                      }
                       
                  }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })
    },
    createAirlines: (req, res) => {
        uploadHelper(req, res, async function(err) {
            try {
                if (err instanceof multer.MulterError) {
                    if(err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length === 0){
                        console.log(err.code === 'LIMIT_UNEXPECTED_FILE' && req.file.length > 0)
                        return responseStandard(res, 'fieldname doesnt match', {}, 500, false)
                    }
                    return responseStandard(res, err.message, {}, 500, false)
                  } else if (err) {
                    return responseStandard(res, err.message, {}, 401, false)
                  }  
                  const schema = joi.object({
                      name: joi.string()
                  })
                  var { value: results, error } = schema.validate(req.body)
                  if (error) {
                      return responseStandard(res, 'Error', {error: error.message}, 400, false)
                  } else {
                      let { name } = results
                      let check = await airlineModel.countAirlines(name)
                      if (check > 0) {
                          return responseStandard(res, 'Airline Already Exist', {}, 401, false)
                      } else {
                          let picture = `uploads/${req.file.filename}`
                          results = {
                              ...results,
                              logo: picture
                          }
                          let data = await airlineModel.createAirlines(results)
              
                          if (data.affectedRows) {
                              return responseStandard(res, `Airline Has been Created`, {results}, 200, true)
                          } else {
                              return responseStandard(res, 'Error to create Airline', {}, 500, false)
                          }
                      }
                  }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })
    },
    deleteAirlines: async (req, res) => {
        const { id } = req.params
        let airline_id  = Number(id)
        // console.log(uid)
        try {
            const data = await airlineModel.deleteAirlines({id: airline_id})
            if(data.affectedRows){
                return responseStandard(res, `Airline Has been deleted`, {})
            } else {
                return responseStandard(res, 'Airline Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}