const { Router } = require('express')

const {loginController, signUpController, updateAvatar} = require('../controllers/auth')

const router = Router()

router.post('/login', loginController)
router.post('/signup', signUpController)

module.exports = router
