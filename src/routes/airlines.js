const { Router } = require('express')

const {
    getAirlinesById,
    getAllAirlines, 
    updateAirlines,
    createAirlines
} = require('../controllers/airline')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', getAirlinesById)
router.get('/', getAllAirlines)
router.post('/', createAirlines)
router.patch('/:id', updateAirlines)

module.exports = router
