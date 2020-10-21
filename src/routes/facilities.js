const { Router } = require('express')

const {
    getFacilityById,
    getFacility, 
    updateFacility,
    createFacility
} = require('../controllers/facilities')

const router = Router()

router.get('/:id', getFacilityById)
router.get('/', getFacility)
router.post('/', createFacility)
router.patch('/:id', updateFacility)

module.exports = router
