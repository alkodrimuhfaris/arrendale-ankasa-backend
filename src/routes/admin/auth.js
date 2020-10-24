const { Router } = require('express')

const {
    loginController, 
    signUpController
} = require('../../controllers/admin/auth')

const router = Router()

const authMiddleware = require('../../middlewares/authentication')

router.post('/login', loginController)
router.post('/signup', authMiddleware.authUser, signUpController)

module.exports = router
