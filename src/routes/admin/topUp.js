const { Router } = require('express')

const topup = require('../../controllers/admin/topUp')

const authMiddleware = require('../../middlewares/authentication')

const router = Router()

router.post('/', authMiddleware.authUser, topup.topUpBalance)

module.exports = router
