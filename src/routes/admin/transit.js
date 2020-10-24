const { Router } = require('express')

const {
    getTransitById,
    getTransit, 
    updateTransit,
    createTransit,
    deleteTransit
} = require('../../controllers/admin/transit')

const authMiddleware = require('../../middlewares/authentication')

const router = Router()

router.get('/:id', getTransitById)
router.get('/', getTransit)
router.post('/', createTransit)
router.patch('/:id', updateTransit)
router.delete('/:id', deleteTransit)

module.exports = router
