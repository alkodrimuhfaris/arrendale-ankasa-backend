const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')
const multer = require('multer')

const cityModel = require('../../models/admin/manageCity')
const uploadHelper = require('../../helpers/uploadHelper')
<<<<<<< HEAD:src/controllers/admin/manageCity.js
=======
const pagination = require('../../helpers/pagination')
>>>>>>> master:src/controllers/destinationList.js


module.exports = {
    createCity: async (req, res) => {
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
                    city_name: joi.string(),
                    country_code: joi.string(),
                    country_name: joi.string(),
                    rating: joi.number()
                  })
                  var { value: results, error } = schema.validate(req.body)
                  if (error) {
                      return responseStandard(res, 'Error', {error: error.message}, 400, false)
                  } else {
                      let { city_name, country_name } = results
                      const check = await cityModel.countCity([city_name, country_name])
                      console.log(check[0].count)
                      if (check[0].count === 0) {
                          let picture = `uploads/${req.file.filename}`
                          results = {
                              ...results,
                              city_picture: picture
                          }
                          let data = await cityModel.createCity(results)
          
                          if (data.affectedRows) {
                              return responseStandard(res, `City Has been Created`, {results}, 200, true)
                          } else {
                              return responseStandard(res, 'Error to create City', {}, 500, false)
                          }
                      }
                      else {
                          return responseStandard(res, `City Already Exist`, {}, 500, false)
                      }
                  }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })        
    },
    getCity: async (req, res) => {
        try {
<<<<<<< HEAD:src/controllers/admin/manageCity.js
            const data = await cityModel.getCity()
            if (data.length) {
                return responseStandard(res, `List of City`, {data})
=======
            req.query.limit = req.query.limit ? req.query.limit : 10
            const {page,limit,limiter} = pagination.pagePrep(req.query)
            const data = await cityModel.getCity(limiter)
            const [{count}] = await cityModel.getCityCount() || 0
            if (data.length) {
                const pageInfo = pagination.paging(count, page, limit, 'manage/city', req)
                return responseStandard(res, `List of City`, {data, pageInfo})
>>>>>>> master:src/controllers/destinationList.js
            } else {
                const pageInfo = pagination.paging(count, page, limit, 'manage/city', req)
                return responseStandard(res, `Nothing found here`, {data, pageInfo}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getCityById: async (req, res) => {
        let { id } = req.params
        try {
            const data = await cityModel.getCityByConditions({ id })
            if(data.length > 0) {
                return responseStandard(res, `City with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'City Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateCity: async (req, res) => {
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
                    city_name: joi.string(),
                    country_code: joi.string(),
                    country_name: joi.string(),
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
                      let data = await cityModel.updateCity(results, id)
      
                      if (data.affectedRows) {
                          return responseStandard(res, `City Has been updated`, {results}, 200, true)
                      } else {
                          return responseStandard(res, 'Error to updated City', {}, 500, false)
                      }
                  }      
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })        
    },
    deleteCity: async (req, res) => {
        const { id } = req.params
        let dest_id  = Number(id)
        // console.log(uid)
        try {
            const data = await cityModel.deleteCity({id: dest_id})
            if(data.affectedRows){
                return responseStandard(res, `City Has been deleted`, {})
            } else {
                return responseStandard(res, 'City Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}