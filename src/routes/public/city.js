const { Router } = require('express')
const city = require('../../controllers/public/city')


const router = Router()

router.get('/search/:city_name', city.searchCity)

module.exports = router
