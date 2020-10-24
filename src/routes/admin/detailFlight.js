const { Router } = require('express')

const detailFlight = require('../../controllers/admin/detailFlight')

const router = Router()
const authMiddleware = require('../../middlewares/authentication')

router.get('/', detailFlight.getAllDetailFlight)
router.get('/:id', detailFlight.getDetailFlightByFlightId)
router.post('/', |authMiddleware.authUser, detailFlight.createFlightDetail)
router.patch('/:id', authMiddleware.authUser, detailFlight.updateFlightDetail)
router.delete('/:id', authMiddleware.authUser, detailFlight.deleteFlightDetail)

module.exports = router
