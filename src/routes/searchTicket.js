const { Router } = require('express')

const {
    getDetailFlightById,
    getDetailFlight
} = require('../controllers/searchTicket')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', getDetailFlightById)
router.get('/', getDetailFlight)

module.exports = router
