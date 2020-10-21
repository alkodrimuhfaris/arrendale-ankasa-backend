const { Router } = require('express')

const booking = require('../controllers/mybooking')

const authMiddleware = require('../middlewares/authentication')

const router = Router()

router.get('/', /*authMiddleware.authUser,*/ booking.getBooking)
router.get('/:id', /*authMiddleware.authUser,*/ booking.getBookingById)
router.post('/', /*authMiddleware.authUser, */ booking.createBooking)

module.exports = router
