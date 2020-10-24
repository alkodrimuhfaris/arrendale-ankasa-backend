const { Router } = require('express')
const city = require('../../controllers/public/city')


const router = Router()

router.get('/search', city.searchCity)

module.exports = router
