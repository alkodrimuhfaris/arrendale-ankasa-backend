const { Router } = require('express')

const {
    loginController, 
    signUpController,
    updatePassword
} = require('../../controllers/user/auth')

const router = Router()

const authMiddleware = require('../../middlewares/authentication')

router.post('/login', loginController)
router.post('/signup', signUpController)
router.post('/password', authMiddleware.authUser, updatePassword)

module.exports = router
