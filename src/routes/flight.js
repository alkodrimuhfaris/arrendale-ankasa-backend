const { Router } = require('express')

const {
    getFlightById,
    getFlight, 
    updateFlight,
    createFlight
} = require('../controllers/flight')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', getFlightById)
router.get('/', getFlight)
router.post('/', createFlight)
router.patch('/:id', updateFlight)

module.exports = router
