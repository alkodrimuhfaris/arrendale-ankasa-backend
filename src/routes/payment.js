const { Router } = require('express')

const payment = require('../controllers/payment')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.post('/topUp', authMiddleware.authUser, payment.topUpBalance)
router.post('/commit', authMiddleware.authUser, payment.commitPayment)

module.exports = router
