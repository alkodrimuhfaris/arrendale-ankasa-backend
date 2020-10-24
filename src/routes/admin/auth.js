const { Router } = require('express')

const {
    loginController, 
    signUpController
} = require('../../controllers/admin/auth')

const router = Router()

router.post('/login', loginController)
router.post('/signup', signUpController)

module.exports = router
