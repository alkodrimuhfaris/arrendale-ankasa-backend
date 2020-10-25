const { Router } = require('express')

const {
    getFlightById,
    getFlight,
    updateFlight,
    createFlight,
    deleteFlight
} = require('../../controllers/admin/flight')

const authMiddleware = require('../../middlewares/authentication')

const router = Router()

router.get('/:id', getFlightById)
router.get('/', getFlight)
router.post('/', createFlight)
router.patch('/:id', updateFlight)
router.delete('/:id', deleteFlight)

module.exports = router
