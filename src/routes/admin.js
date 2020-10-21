const { Router } = require('express')

const {
    getUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/admin')

const {
    getFacilityById,
    getFacility, 
    updateFacility,
    createFacility,
    deleteFacility
} = require('../controllers/facilities')


const {
    getAirlinesById,
    getAllAirlines, 
    updateAirlines,
    createAirlines,
    deleteAirlines
} = require('../controllers/airline')

const authMiddleware = require('../middlewares/authentication')


const {
    loginControllerAdmin, 
    signUpAdminController
} = require('../controllers/auth')


const {
    getDestinationById,
    getDestination, 
    updateDestination,
    createDestination,
    deleteDestination
} = require('../controllers/destinationList')

const router = Router()

router.post('/login', loginControllerAdmin)
router.post('/signup', signUpAdminController)
router.get('/listuser', authMiddleware.authUser, authMiddleware.authRole(1), getUser)
router.get('/listuser/:id', authMiddleware.authUser, authMiddleware.authRole(1), getUserById)
router.patch('/listuser/:id', authMiddleware.authUser, authMiddleware.authRole(1), updateUser)
router.delete('/listuser/:id', authMiddleware.authUser, authMiddleware.authRole(1), deleteUser)


router.get('/airline/:id', getAirlinesById)
router.get('/airline', getAllAirlines)
router.post('/airline', createAirlines)
router.patch('/airline/:id', updateAirlines)
router.delete('/airline/:id', deleteAirlines)


router.get('/facility/:id', getFacilityById)
router.get('/facility', getFacility)
router.post('/facility', createFacility)
router.patch('/facility/:id', updateFacility)
router.delete('/facility/:id', deleteFacility)


router.get('/:id', getDestinationById)
router.get('/', getDestination)
router.post('/', createDestination)
router.patch('/:id', updateDestination)
router.delete('/:id', deleteDestination)

module.exports = router