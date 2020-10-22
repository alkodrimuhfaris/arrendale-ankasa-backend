const { Router } = require('express')

const reciept = require('../controllers/reciept')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/', authMiddleware.authUser, reciept.getAllTransaction)
router.get('/:id', authMiddleware.authUser, reciept.getTransactionById)

module.exports = router
