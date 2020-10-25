const { Router } = require('express')

const payment = require('../../controllers/user/payment')

const authMiddleware = require('../../middlewares/authentication')

const router = Router()

router.post('/commit', authMiddleware.authUser, payment.commitPayment)

module.exports = router
