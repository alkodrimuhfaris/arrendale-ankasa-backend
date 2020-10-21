const { Router } = require('express')

const {
    getUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/manageUser')

const {
    loginControllerAdmin, 
    signUpAdminController
} = require('../controllers/auth')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.post('/login', loginControllerAdmin)
router.post('/signup', signUpAdminController)
router.get('/listuser', authMiddleware.authUser, authMiddleware.authRole(1), getUser)
router.get('/listuser/:id', authMiddleware.authUser, authMiddleware.authRole(1), getUserById)
router.patch('/listuser/:id', authMiddleware.authUser, authMiddleware.authRole(1), updateUser)
router.delete('/listuser/:id', authMiddleware.authUser, authMiddleware.authRole(1), deleteUser)

module.exports = router