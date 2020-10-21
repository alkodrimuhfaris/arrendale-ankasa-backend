const { Router } = require('express')

const {
    getFlightById,
    getFlight,
    getFlightSearch, 
    updateFlight,
    createFlight,
    deleteFlight
} = require('../controllers/flight')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', getFlightById)
router.get('/', getFlight)
router.get('/search', getFlightSearch)
router.post('/', createFlight)
router.patch('/:id', updateFlight)
router.delete('/:id', deleteFlight)

module.exports = router
