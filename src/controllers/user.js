const multer = require('multer')
const uploadHelper = require('../helpers/uploadHelper')
const bcrypt = require('bcrypt')
const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const userModel = require('../models/user')


module.exports = {
    getProfile: async (req, res) => {
        let { id } = req.user
        try {
            const data = await userModel.getDetailProfile({ id })
            if(data.length > 0) {
                return responseStandard(res, `Profile with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'Profile Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateProfile: async (req, res) => {
        let { id } = req.user
        id = Number(id)
        const schema = joi.object({
            username: joi.string(),
            email: joi.string(),
            password: joi.string(),
            phone_number: joi.string(),
            city: joi.string(),
            address: joi.string(),
            postal_code: joi.number()
        })
        let { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            
        let { username, email, password, phone_number, city, address, postal_code } = results
            try {
                if (password) {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(results.password, salt)
                    results = {
                        password: hashedPassword
                    }
                    const update = await userModel.updateUser(results, id )
                    if(update.affectedRows) {
                        return responseStandard(res, `Profile Has been Updated`, {results})
                    } else {
                        return responseStandard(res, 'Profile Not found', {}, 401, false)
                    }
                } else if ( username || email || phone_number || city || address ||  postal_code ){
            
                    const update = await userModel.updateUser(results, id)
                        
                    if(update.affectedRows) {
                        return responseStandard(res, `Profile Has been Updated`, {results})
                    } else {
                        return responseStandard(res, 'Profile Not found', {}, 401, false)
                    }
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    updateAvatar: (req, res) => {
        let { id } = req.user
        let uid = Number(id)
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
                  
                  let picture = `uploads/${req.file.filename}`
                  let results = {
                      avatar: picture
                  }
                  let data = await userModel.updateUser(results, uid)
      
                  if (data.affectedRows) {
                      return responseStandard(res, `Avatar Has been Updated`, {results}, 200, true)
                  } else {
                      return responseStandard(res, 'Error to update avatar', {}, 500, false)
                  }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        })
    },
    deleteProfile: async (req, res) => {
        const { id } = req.user
        let uid  = Number(id)
        // console.log(uid)
        try {
            const data = await userModel.deleteUser({id: uid})
            if(data.affectedRows){
                return responseStandard(res, `Profile Has been deleted`, {})
            } else {
                return responseStandard(res, 'Profile Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}