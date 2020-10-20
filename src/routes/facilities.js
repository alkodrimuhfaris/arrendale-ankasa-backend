const { Router } = require('express')

const {
    getFacilityById,
    getFacility, 
    updateFacility,
    createFacility,
    deleteFacility
} = require('../controllers/facilities')

const router = Router()

router.get('/:id', getFacilityById)
router.get('/', getFacility)
router.post('/', createFacility)
router.patch('/:id', updateFacility)
router.delete('/:id', deleteFacility)

module.exports = router
