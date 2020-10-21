const { Router } = require('express')

const {
    getDetailFlightById,
    getDetailFlight
} = require('../controllers/detailFlight')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', getDetailFlightById)
router.get('/', getDetailFlight)

module.exports = router
