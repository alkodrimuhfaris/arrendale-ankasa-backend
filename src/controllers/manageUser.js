const bcrypt = require('bcrypt')
const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')

const userModel = require('../models/user')


module.exports = {
    getUser: async (req, res) => {
        try {
            const data = await userModel.getAllUser()
            if(data.length > 0) {
                return responseStandard(res, `List Of users`, {data})
            } else {
                return responseStandard(res, 'Users Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getUserById: async (req, res) => {
        let { id } = req.params
        let uid  = Number(id)
        try {
            const data = await userModel.getDetailProfile({id: uid})
            if(data.length > 0) {
                return responseStandard(res, `List Of users`, {data})
            } else {
                return responseStandard(res, 'Users Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateUser: async (req, res) => {
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
                        return responseStandard(res, `User Has been Updated`, {results})
                    } else {
                        return responseStandard(res, 'User Not found', {}, 401, false)
                    }
                } else if ( username || email || phone_number || city || address ||  postal_code ){
            
                    const update = await userModel.updateUser(results, id)
                        
                    if(update.affectedRows) {
                        return responseStandard(res, `User Has been Updated`, {results})
                    } else {
                        return responseStandard(res, 'User Not found', {}, 401, false)
                    }
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    deleteUser: async (req, res) => {
        const { id } = req.params
        let uid  = Number(id)
        // console.log(uid)
        try {
            const data = await userModel.deleteUser({id: uid})
            if(data.affectedRows){
                return responseStandard(res, `User Has been deleted`, {})
            } else {
                return responseStandard(res, 'User Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
      }
}