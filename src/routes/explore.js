const { Router } = require('express')
const flight = require('../controllers/flight')
const city = require('../controllers/explore')


const router = Router()

router.get('/flight', flight.getFlight)
router.get('/popular', city.getPopularCity)

module.exports = router
