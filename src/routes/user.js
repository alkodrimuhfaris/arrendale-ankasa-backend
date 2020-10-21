const { Router } = require('express')

const {
    getProfile,
    updateProfile, 
    updateAvatar,
    deleteProfile
} = require('../controllers/user')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/profile', authMiddleware.authUser, authMiddleware.authRole(3), getProfile)
router.patch('/profile', authMiddleware.authUser, authMiddleware.authRole(3), updateProfile)
router.patch('/profile/upload', authMiddleware.authUser, authMiddleware.authRole(3), updateAvatar)
router.delete('/profile', authMiddleware.authUser, authMiddleware.authRole(3), deleteProfile)

module.exports = router