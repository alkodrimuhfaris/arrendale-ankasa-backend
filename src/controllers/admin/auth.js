const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')
const {v4:uuidv4} = require('uuid')
const {
    APP_KEY,
    UNIQUE_KEY
} = process.env

const authModel = require('../../models/admin/auth')


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
                console.log(isExist)
                const [{uniqueKey:identifier, id, city_id}] = isExist
                const checkAdmin = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
                if (isExist.length > 0) {
                    if (checkAdmin[0].user_id === id) {
                        if (isExist[0].password) {
                            bcrypt.compare(password, isExist[0].password, (err, result) => {
                                if(result) {
                                    jwt.sign({id: isExist[0].id, role_id: isExist[0].role_id, city_id, identifier}, APP_KEY, (err, token)=>{
                                        return responseStandard(res, {token: token}, {}, 200, true)
                                    }) 
                                }
                                else {
                                    return responseStandard(res, 'Wrong email or password', {}, 400, false)
                                }
                            })
                        }
                    }else {
                        return responseStandard(res, 'You have no grant access to this!', {}, 400, false)
                    }
                } else {
                    return responseStandard(res, 'Account Not Found', {}, 400, false)
                }   
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    signUpController: async(req, res) => {
        let {id, role_id, identifier} = req.user
        if(role_id !== 1) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}
        
        const schema = joi.object({
            username: joi.string().required(),
            email: joi.string().required(),
            password: joi.string().required(),
        })
        try {
            let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
            if(adminCheck[0].user_id !== id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}
            
            let { value: results, error } = schema.validate(req.body)
            if (error) {
                return responseStandard(res, 'Error', {error: error.message}, 400, false)
            } else {
                const { email } = results
                const isExist = await authModel.checkUserExist({ email })
                if (isExist.length > 0) {
                    return responseStandard(res, 'Email already used', {}, 401, false)
                } else {
                    let { name } = results
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(results.password, salt)
                    let uniqueKey = uuidv4()
                    results = {
                        ...results,
                        role_id: 1,                    
                        uniqueKey,
                        password: hashedPassword,
                    }
                    const data = await authModel.signUp(results)
                    if (data.affectedRows) {
                        await authModel.signUp({id:uniqueKey, user_id: data.insertId}, 'uuid_admin')
                        delete result.uniqueKey
                        delete result.password
                        results = {
                            id: data.insertId,
                            ...results
                        }
                        return responseStandard(res, 'Success to signup As Admin', { results }, 200, true)
                    } else {
                        return responseStandard(res, 'Failed to signup', {}, 401, false)
                    }
                }
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updatePassword: async (req, res) => {
        let {id, identifier} = req.user
        if(!id) {return responseStandard(res, 'Forbidden Access!', {}, 400, false)}
        try {
            let adminCheck = await authModel.checkUserExist({id:identifier}, 'uuid_admin')
            if(adminCheck[0].user_id !== id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}
            let adminData = await authModel.checkUserExist({id})

            const schema = joi.object({
                oldPassword: joi.string().required(),
                newPassword: joi.string().required(),
                confirmPassword: joi.ref('newPassword')
            })
            let { value: results, error } = schema.validate(req.body)
            if (error) {return responseStandard(res, 'Error', {error: error.message}, 400, false)}
            const { oldPassword, newPassword } = results
            const {password} = adminData[0]
            bcrypt.compare(oldPassword, password, async (err, result) => {
                if(result) {
                    const salt = await bcrypt.genSalt(10)
                    const password = await bcrypt.hash(newPassword, salt)
                    let patchPassword = await authModel.updateUser({password}, {id})
                    if (patchPassword.affectedRows){
                        return responseStandard(res, 'Password updated!', {}, 200, true)    
                    }
                }
                else {
                    return responseStandard(res, 'Old password is wrong!', {}, 400, false)
                }
            })
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)                
        }
    }
}