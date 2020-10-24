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
<<<<<<< HEAD:src/controllers/auth.js
                let [{city_id}] = isExist
                console.log(isExist)
                if (isExist.length > 0) {
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
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
    loginControllerAdmin: async(req, res) => {
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
=======
                if (isExist[0].uniqueKey === UNIQUE_KEY) {
                    if (isExist.length > 0) {
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/auth.js
                        if (isExist[0].password) {
                            bcrypt.compare(password, isExist[0].password, (err, result) => {
                                if(result) {
                                    jwt.sign({id: isExist[0].id, role_id: isExist[0].role_id, city_id, identifier}, APP_KEY, {expiresIn: 1511}, (err, token)=>{
                                        return responseStandard(res, {token: token}, {}, 200, true)
                                    }) 
                                }
                                else {
                                    return responseStandard(res, 'Wrong email or password', {}, 400, false)
                                }
                            })
                        }
                    }else {
<<<<<<< HEAD:src/controllers/auth.js
                        return responseStandard(res, 'You have no grant access to this!', {}, 400, false)
=======
                        return responseStandard(res, 'Internal server Error', {}, 500, false)
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/auth.js
                    }
                } else {
                    return responseStandard(res, 'Account Not Found', {}, 400, false)
                }   
            } catch (e) {
                return responseStandard(res, e.message, {}, 401, false)
            }
        }
    },
<<<<<<< HEAD:src/controllers/auth.js
    signUpUserController: async(req, res) => {
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
                    }
                    const data = await authModel.signUp(results)
                    if (data.affectedRows) {
                        results = {
                            id: data.insertId,
                            ...results,
                            uniqueKey: undefined,
                            password: undefined
                        }
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
    signUpAdminController: async(req, res) => {
        let {id, role_id, identifier} = req.user
        if(role_id !== 1) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}
        
=======
    signUpController: async(req, res) => {
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/auth.js
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
<<<<<<< HEAD:src/controllers/auth.js
                        role_id: 1,                    
                        uniqueKey,
=======
                        role_id: 1,                        
                        uniqueKey: UNIQUE_KEY,
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/auth.js
                        password: hashedPassword,
                    }
                    const data = await authModel.signUp(results)
                    if (data.affectedRows) {
<<<<<<< HEAD:src/controllers/auth.js
                        await authModel.signUp({id:uniqueKey, user_id: data.insertId}, 'uuid_admin')
                        delete result.uniqueKey
                        delete result.password
                        results = {
                            id: data.insertId,
                            ...results,
                            identifier: uniqueKey
                        }
                        return responseStandard(res, 'Success to signup As Admin', { results }, 200, true)
=======
                        // results = {
                        //     id: data.insertId,
                        //     ...results,
                        //     role_id: undefined,
                        //     password: undefined
                        // }
                        return responseStandard(res, 'Success to signup As Admin', {}, 200, true)
>>>>>>> da20bb07365b441faeac1d20142f506cf529be2b:src/controllers/admin/auth.js
                    } else {
                        return responseStandard(res, 'Failed to signup', {}, 401, false)
                    }
                }
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
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
                return responseStandard(res, e.message, {}, 401, false)                
            }
        }
    }
}