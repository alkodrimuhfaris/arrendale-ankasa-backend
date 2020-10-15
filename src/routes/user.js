const { Router } = require('express')

const {loginController} = require('../controllers/auth')

const router = Router()

router.post('/login', loginController)

module.exports = router
