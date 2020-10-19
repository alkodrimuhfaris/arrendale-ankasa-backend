const { Router } = require('express')
const {
  getFlight
} = require('../controllers/flight')
const {
  getPopularCity
} = require('../controllers/explore')


const router = Router()

router.get('/flight', getFlight)
router.get('/popular', getPopularCity)

module.exports = router
