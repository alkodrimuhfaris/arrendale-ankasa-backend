const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responseStandard = require('../helpers/responseStandard')
const joi = require('joi')
const {
    APP_KEY
} = process.env

const authModel = require('../models/user')


module.exports = {
    loginController: async(req, res) => {
        const schema = joi.object({
            email: joi.string().required(),
            password: joi.string().required(),
        })

        let { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            const { email, password } = results
            const isExist = await authModel.checkUserExist({ email })
            console.log(isExist)
            if (isExist.length > 0) {
                if (isExist[0].password) {
                    bcrypt.compare(password, isExist[0].password, (err, result) => {
                        if(result) {
                            jwt.sign({id: isExist[0].id}, APP_KEY, {expiresIn: 1511}, (err, token)=>{
                                return responseStandard(res, {token: token}, {}, 200, true)
                            }) 
                        }
                        else {
                            return responseStandard(res, 'Wrong email or password', {}, 400, false)
                        }
                    })
                }
            }else {
                return responseStandard(res, 'Wrong email or password', {}, 400, false)
            }   
        }
    }
}