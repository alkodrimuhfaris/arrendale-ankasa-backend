const { Router } = require('express')

const detailFlight = require('../../controllers/admin/detailFlight')

const router = Router()
const authMiddleware = require('../../middlewares/authentication')

router.get('/', detailFlight.getAllDetailFlight)
router.get('/:id', detailFlight.getDetailFlightByFlightId)
router.post('/', detailFlight.createFlightDetail)
router.patch('/:id', detailFlight.updateFlightDetail)
router.delete('/:id', detailFlight.deleteFlightDetail)

module.exports = router
