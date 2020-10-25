const { Router } = require('express')

const searchTicketCtl = require('../../controllers/public/searchTicketAdv')

const router = Router()

router.get('/:id', searchTicketCtl.getDetailFlight)
router.get('/',  searchTicketCtl.searchTicket)

module.exports = router
