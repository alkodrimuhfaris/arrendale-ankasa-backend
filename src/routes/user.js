const { Router } = require('express')

const {
    getProfile,
    updateProfile, 
    updateAvatar
} = require('../controllers/user')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/profile', authMiddleware.authUser, getProfile)
router.patch('/profile/', authMiddleware.authUser, updateProfile)
router.patch('/profile/upload', authMiddleware.authUser, updateAvatar)

module.exports = router
