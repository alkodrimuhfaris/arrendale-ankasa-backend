const { Router } = require('express')

const {
    getUser,
    getUserById,
    updateUser, 
    deleteUser
} = require('../../controllers/admin/manageUser')

const authMiddleware = require('../../middlewares/authentication')

const router = Router()

router.get('/', authMiddleware.authUser, authMiddleware.authRole(1), getUser)
router.get('/:id', authMiddleware.authUser, authMiddleware.authRole(1), getUserById)
router.patch('/:id', authMiddleware.authUser, authMiddleware.authRole(1), updateUser)
router.delete('/:id', authMiddleware.authUser, authMiddleware.authRole(1), deleteUser)

module.exports = router