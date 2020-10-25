const { Router } = require('express')

const {
    loginController, 
    signUpController,
    updatePassword
} = require('../../controllers/admin/auth')

const router = Router()

const authMiddleware = require('../../middlewares/authentication')

router.post('/login', loginController)
router.post('/signup', authMiddleware.authUser, signUpController)
router.post('/password', authMiddleware.authUser, updatePassword)

module.exports = router
