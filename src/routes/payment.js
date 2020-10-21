const { Router } = require('express')

const payment = require('../controllers/payment')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.post('/topUp', payment.topUpBalance)
router.post('/commit', payment.commitPayment)

module.exports = router
