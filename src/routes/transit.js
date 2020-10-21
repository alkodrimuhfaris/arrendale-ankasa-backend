const { Router } = require('express')

const {
    getTransitById,
    getTransit, 
    updateTransit,
    createTransit
} = require('../controllers/transit')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/:id', getTransitById)
router.get('/', getTransit)
router.post('/', createTransit)
router.patch('/:id', updateTransit)

module.exports = router
