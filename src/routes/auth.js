const { Router } = require('express')

const {
    loginControllerUser, 
    signUpUserController
} = require('../controllers/auth')

const router = Router()

router.post('/login', loginControllerUser)
router.post('/signup', signUpUserController)

module.exports = router
