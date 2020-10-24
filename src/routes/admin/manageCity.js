const { Router } = require('express')

const {
    getCityById,
    getCity, 
    updateCity,
    createCity,
    deleteCity
} = require('../../controllers/admin/manageCity')

const router = Router()

router.get('/:id', getCityById)
router.get('/', getCity)
router.post('/', createCity)
router.patch('/:id', updateCity)
router.delete('/:id', deleteCity)

module.exports = router
