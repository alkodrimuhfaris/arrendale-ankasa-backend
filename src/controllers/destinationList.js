const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const destinationModel = require('../models/destinationList')


module.exports = {
    createDestination: async (req, res) => {
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
                    city_name: joi.string().required(),
                    country_code: joi.string().required(),
                    rating: joi.number().require()
                  })
                  var { value: results, error } = schema.validate(req.body)
                  if (error) {
                      return responseStandard(res, 'Error', {error: error.message}, 400, false)
                  } else {
                      let { name, nation } = results
                      const check = await destinationModel.countDestination([name, nation])
                      if (check === 0) {
                          let picture = `uploads/${req.file.filename}`
                          results = {
                              ...results,
                              city_picture: picture
                          }
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
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })        
    },
    getDestination: async (req, res) => {
        try {
            const data = await destinationModel.getDestination()
            if (data.length) {
                return responseStandard(res, `List of Destination`, {data})
            } else {
                return responseStandard(res, `Nothing found here`, {data}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getDestinationById: async (req, res) => {
        let { id } = req.params
        try {
            const data = await destinationModel.getDestinationByConditions({ id })
            if(data.length > 0) {
                return responseStandard(res, `Destination with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'Destination Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateDestination: async (req, res) => {
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
                      city_name: joi.string(),
                      country_code: joi.string(),
                      rating: joi.number()
                  })
                  var { value: results, error } = schema.validate(req.body)
                  if (error) {
                      return responseStandard(res, 'Error', {error: error.message}, 400, false)
                  } else {
                      let picture = `uploads/${req.file.filename}`
                      results = {
                          ...results,
                          city_picture: picture
                      }
                      let data = await destinationModel.updateDestination(results, id)
      
                      if (data.affectedRows) {
                          return responseStandard(res, `Destination Has been Created`, {results}, 200, true)
                      } else {
                          return responseStandard(res, 'Error to create Destination', {}, 500, false)
                      }
                  }      
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })        
    },
    deleteDestination: async (req, res) => {
        const { id } = req.params
        let dest_id  = Number(id)
        // console.log(uid)
        try {
            const data = await destinationModel.deleteDestination({id: dest_id})
            if(data.affectedRows){
                return responseStandard(res, `Destination Has been deleted`, {})
            } else {
                return responseStandard(res, 'Destination Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}