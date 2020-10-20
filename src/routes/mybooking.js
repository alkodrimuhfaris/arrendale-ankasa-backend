const { Router } = require('express')

const {
  getBooking,
  getBookingById,
  createBooking
} = require('../controllers/mybooking')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/', /*authMiddleware.authUser,*/ getBooking)
router.get('/:id', /*authMiddleware.authUser,*/ getBookingById)
router.create('/profile/upload', /*authMiddleware.authUser, */ createBooking)

module.exports = router
