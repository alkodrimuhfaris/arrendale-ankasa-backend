const { Router } = require('express')
const city = require('../../controllers/public/explore')


const router = Router()

router.get('/popular', city.getPopularCity)
router.get('/trending', city.getMostVisitedCity)

module.exports = router
