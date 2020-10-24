const myEmail = require('../../helpers/sendMail')

const {v4:uuidv4} = require('uuid')

const responseStandard = require('../../helpers/responseStandard')
const forgotPasswordModel = require('../../models/user/forgotPassword')
const authModel = require('../../models/user/auth')
const joi = require('joi')
const bcrypt = require('bcrypt')

const userModel = require('../../models/user/user')

module.exports = {
    resetPassword: async (req, res) => {
        const {email} = req.body
        let user = email
        let resetcode = ''

        const check = await authModel.checkUserExist({ email: user })
        check.length && (resetcode = uuidv4())
        
        result = await myEmail.mailHelper([email, resetcode])
        
        if (result.rejected.length === 0) {
            let update = await forgotPasswordModel.createResetCode({reset_code: resetcode}, email)
            if (update.affectedRows) {
                return responseStandard(res, 'Success to send reset email')
            } else {
                return responseStandard(res, 'Internal Server Error', 500)                
            }
        }
    },
    matchResetCode: async (req, res) => {
        let schema = joi.object({
            email: joi.string().email().required(),
            resetcode: joi.string().required(),
            newPassword: joi.string().required(),
            confirmNewPassword: joi.ref('newPassword')
        })
        let { value: credentials, error } = schema.validate(req.body)
        if (error) {return responseStandard(res, 'Error', {error: error.message}, 400, false)} 

        try {
            let {resetcode, email, newPassword} = credentials
            if (!resetcode) {return responseStandard(res, 'Please input reset code!',{}, 400, false)}

            const salt = await bcrypt.genSalt(10)
            newPassword = await bcrypt.hash(newPassword, salt)
    
            let userData = await adminAuth.checkUserExist({email})
            if(!userData.length) {return responseStandard(res, 'User not found',{}, 400, false)}

            let {reset_code, id, uniqueKey} = userData[0]
            let adminCheck = await authModel.checkUserExist({id:uniqueKey}, 'uuid_admin')
            if(adminCheck[0].user_id !== id) {return responseStandard(res, 'Access Forbidden!', {}, 403, false)}

            if(!reset_code && reset_code !== resetcode) {return responseStandard(res, 'Reset Code doesnt match',{}, 400, false)}

            let update = await forgotPasswordModel.createResetCode({reset_code: null}, email)
            if (!update.affectedRows) {return responseStandard(res, 'Reset code failed',{}, 400, false)}

            let patchPassword = await forgotPasswordModel.changePassword({password:newPassword}, {id})
            if (patchPassword.affectedRows) {
                return responseStandard(res, 'Reset password succed!',{}, 200, true)
            } else {
                return responseStandard(res, 'Reset password failed!',{}, 200, true)
            }    
        } catch (err) {
            return responseStandard(res, err, {}, 500, false)
        }
    }
}
