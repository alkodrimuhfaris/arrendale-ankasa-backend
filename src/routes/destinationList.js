const { Router } = require('express')

const {
    getDestinationById,
    getDestination, 
    updateDestination,
    createDestination,
    deleteDestination
} = require('../controllers/destinationList')

const router = Router()

router.get('/:id', getDestinationById)
router.get('/', getDestination)
router.post('/', createDestination)
router.patch('/:id', updateDestination)
router.delete('/:id', deleteDestination)

module.exports = router
