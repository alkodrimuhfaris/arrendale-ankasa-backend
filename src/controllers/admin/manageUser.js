const bcrypt = require('bcrypt')
const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')
let paging = require('../../helpers/pagination')

const userModel = require('../../models/user/user')


module.exports = {
    getUser: async (req, res) => {
        try {
            const countuser = await userModel.countUser()
            console.log('-------------------------')
            console.log(countuser[0].count)
            console.log('-------------------------')

            let { search, orderBy } = req.query
            const page = paging.pagination(req, countuser[0].count)
            let { offset=0, pageInfo } = page
            const { limitData: limit=5 } = pageInfo
            if (typeof search === 'object') {
                searchKey = Object.keys(search)[0]
                searchValue = Object.values(search)[0]
            } else {
                searchKey = 'username'
                searchValue = search || ''
            }
            if (typeof orderBy === 'object') {
            orderByKey = Object.keys(orderBy)[0]
            orderByValue = Object.values(orderBy)[0]
            } else {
            orderByKey = 'id'
            orderByValue = orderBy || 'ASC'
            }
            const results = await userModel.searchUsers([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
            console.log(results)
            return responseStandard(res, 'List of User', {results, pageInfo})

        } catch (e) {
            return responseStandard(res, e.message, {}, 500, false)
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