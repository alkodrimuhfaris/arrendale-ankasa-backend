const { Router } = require('express')

const {loginController} = require('../controllers/user')

const router = Router()

router.post('/login', loginController)

module.exports = router
