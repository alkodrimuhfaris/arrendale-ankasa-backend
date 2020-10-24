const { Router } = require('express')
const city = require('../controllers/city')


const router = Router()

router.get('/search', city.searchCity)

module.exports = router
