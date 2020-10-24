const { Router } = require('express')

const {
    getDetailFlightById,
    getDetailFlight
} = require('../controllers/searchTicket')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', authMiddleware.authUser, getDetailFlightById)
router.get('/',authMiddleware.authUser,  getDetailFlight)

module.exports = router
