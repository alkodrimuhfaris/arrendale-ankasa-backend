const myEmail = require('../helpers/sendMail')
const keyNumberRandom = require('../helpers/randomizer')
const  uniqueKey = keyNumberRandom.randomizer()

const responseStandard = require('../helpers/responseStandard')

let randomList = [
    'abcde',
    'bcdea',
    'cdeab',
    'deabc'
]


module.exports = {
    resetPassword: async (req, res) => {
        const {email} = req.body
        console.log(email)
        const result = await myEmail.mailHelper([email, uniqueKey])
        
        if (result.rejected.length === 0) {
            return responseStandard(res, 'Success to send reset email')
        }
    },
    matchResetCode: (req, res) => {
        const {reset_code} = req.body
        
        if (randomList.includes(reset_code)) {
            return responseStandard(res, 'Reset Code match')
        } else {
            return responseStandard(res, 'Reset Code doesnt match', {}, 401, false)
        }
    }
}
