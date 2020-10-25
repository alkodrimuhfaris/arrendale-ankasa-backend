const { Router } = require('express')

const {
    getDetailFlightById,
    getDetailFlight
} = require('../../controllers/public/searchTicket')


const router = Router()

router.get('/:id', getDetailFlightById)
router.get('/',  getDetailFlight)

module.exports = router
