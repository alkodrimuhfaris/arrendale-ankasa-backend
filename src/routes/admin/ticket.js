const { Router } = require('express')

const ticket = require('../../controllers/admin/ticket')

const authMiddleware = require('../../middlewares/authentication')

const router = Router()

router.get('/', authMiddleware.authUser, ticket.getAllTicket)
router.get('/:id', authMiddleware.authUser, ticket.getTicketByUserId)
router.get('/booking/:id/:booking_id', authMiddleware.authUser, ticket.getTicketByBookingId)
router.delete('/delete/:id', authMiddleware.authUser, ticket.deleteTicket)

module.exports = router

