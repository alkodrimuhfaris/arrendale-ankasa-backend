const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')
const {
    APP_KEY,
} = process.env

const authModel = require('../../models/user/auth')


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
            try {
                const isExist = await authModel.checkUserExist({ email })
                if (isExist.length > 0) {
                    let city_id = isExist[0].city_id ? isExist[0].city_id : 9
                    console.log(isExist)
                    if (isExist[0].password) {
                        bcrypt.compare(password, isExist[0].password, (err, result) => {
                            if(result) {
                                jwt.sign({id: isExist[0].id, role_id: isExist[0].role_id, city_id, identifier:0}, APP_KEY, {expiresIn: 1511}, (err, token)=>{
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
            } catch (e) {
                return responseStandard(res, e.message, {}, 500, false)
            }
        }
    },
    signUpController: async(req, res) => {
        const schema = joi.object({
            username: joi.string().required(),
            email: joi.string().required(),
            password: joi.string().required(),
        })
        
        let { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            const { email } = results
            try {
                const isExist = await authModel.checkUserExist({ email })
                if (isExist.length > 0) {
                    return responseStandard(res, 'Email already used', {}, 401, false)
                } else {
                    let { name } = results
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(results.password, salt)
                    results = {
                        ...results,
                        role_id: 3,
                        password: hashedPassword,
                        uniqueKey: 0
                    }
                    const data = await authModel.signUp(results)
                    if (data.affectedRows) {
                        results = {
                            id: data.insertId,
                            ...results
                        }
                        delete results.password
                        delete results.uniqueKey
                        return responseStandard(res, 'Success to signup', { results }, 200, true)
                    } else {
                        return responseStandard(res, 'Failed to signup', {}, 401, false)
                    }
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    forgotPassword: async(req, res) => {
        const schema = joi.object({
            password: joi.string().required()
        })

        let { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            const { email, password } = results
            try {
                const isExist = await authModel.checkUserExist({ email })
                if (isExist.length > 0) {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(password, salt)
                    results = {
                        password: hashedPassword,
                    }
                    const data = await authModel.signUp(results)
                    if (data.affectedRows) {
                        return responseStandard(res, 'Success to change password', { results }, 200, true)
                    }
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 500, false)                
            }
        }
    }
}