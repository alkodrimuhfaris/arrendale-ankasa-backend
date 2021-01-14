const { Router } = require('express')

const {
    getDetailFlightById,
    searchAllFlight
} = require('../../controllers/public/searchTicket')


const router = Router()

router.get('/:id', getDetailFlightById)
router.get('/',  searchAllFlight)

module.exports = router
