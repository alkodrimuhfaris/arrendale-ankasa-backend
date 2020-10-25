const { Router } = require('express')

const { resetPassword,
        matchResetCode
 } = require('../../controllers/admin/forgotPassword')

const router = Router()

router.post('/', resetPassword)
router.post('/match', matchResetCode)

module.exports = router