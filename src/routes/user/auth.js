const { Router } = require('express')

const {
    loginController, 
    signUpController
} = require('../../controllers/user/auth')

const router = Router()

router.post('/login', loginController)
router.post('/signup', signUpController)

module.exports = router
