const { Router } = require('express')

const {
    getDetailFlightById,
    getDetailFlight, 
    updateDetailFlight,
    createDetailFlight
} = require('../controllers/flightDetail')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', getDetailFlightById)
router.get('/', getDetailFlight)
router.post('/', createDetailFlight)
router.patch('/:id', updateDetailFlight)

module.exports = router
