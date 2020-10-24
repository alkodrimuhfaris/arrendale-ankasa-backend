const { Router } = require('express')

const {
    getClassFlightById,
    getClassFlight, 
    updateClassFlight,
    createClassFlight,
    deleteClassFlight
} = require('../controllers/classFLight')

const router = Router()

router.get('/:id', getClassFlightById)
router.get('/', getClassFlight)
router.post('/', createClassFlight)
router.patch('/:id', updateClassFlight)
router.delete('/:id', deleteClassFlight)

module.exports = router
