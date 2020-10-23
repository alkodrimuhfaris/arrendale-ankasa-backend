const myEmail = require('../../helpers/sendMail')

const {v4:uuidv4} = require('uuid')

const responseStandard = require('../../helpers/responseStandard')
const forgotPasswordModel = require('../../models/user/forgotPassword')
const authModel = require('../../models/user/auth')

const {
    UNIQUE_KEY
} = process.env

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
                responseStandard(res, 'Success to send reset email')
            } else {
                responseStandard(res, 'Internal Server Error', 500)                
            }
        }
    },
    matchResetCode: async (req, res) => {
        let {resetcode} = req.body
        if (resetcode !== 0 && resetcode !== '') {
            const check = await authModel.checkUserExist({ reset_code: resetcode })
            console.log(check)
            if (check.length && check[0].role_id===1 && check[0].uniqueKey === UNIQUE_KEY) {
                let update = await forgotPasswordModel.createResetCode({reset_code: 0}, email)
                return responseStandard(res, 'Reset Code match', {}, 200, true)
            } else {
                return responseStandard(res, 'Reset Code doesnt match', {}, 400, false)
            }
        }
    }
}
