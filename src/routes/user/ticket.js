const { Router } = require('express')

const ticket = require('../../controllers/user/ticket')

const authMiddleware = require('../../middlewares/authentication')

const router = Router()

router.get('/', authMiddleware.authUser, ticket.getAllTicket)
router.get('/:id', authMiddleware.authUser, ticket.getTicketById)
router.get('/booking/:id', authMiddleware.authUser, ticket.getTicketByBookingId)

module.exports = router
