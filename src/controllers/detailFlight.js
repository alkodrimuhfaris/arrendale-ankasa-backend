const responseStandard = require('../helpers/responseStandard')
const paging = require('../helpers/pagination')

const detailFlightModel = require('../models/detailFlight')

module.exports = {
    getDetailFlightById: async (req, res) => {
        let { id } = req.params
        try {
            const data = await detailFlightModel.getDetailFlightByConditions(id)
            if(data.length > 0) {
                return responseStandard(res, `DetailFlight with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'DetailFlight Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    getDetailFlight: async (req, res) => {
        try {
            const countTotalDetailFlight = await detailFlightModel.countDetailFlight()
            // console.log(countTotalDetailFlight[0].count)
            let { search, orderBy } = req.query
            const page = paging.pagination(req, countTotalDetailFlight[0].count)
            let { offset=0, pageInfo } = page
            const { limitData: limit=5 } = pageInfo
            if (typeof search === 'object') {
                searchKey = Object.keys(search)[0]
                searchValue = Object.values(search)[0]
            } else {
                searchKey = 'flight.id'
                searchValue = search || ''
            }
            if (typeof orderBy === 'object') {
            orderByKey = Object.keys(orderBy)[0]
            orderByValue = Object.values(orderBy)[0]
            } else {
            orderByKey = 'id'
            orderByValue = orderBy || 'ASC'
            }
            if (searchKey === 'departure_time' || searchKey === 'arrived_time') {
                console.log('true')
                console.log(searchValue)
                const data = await detailFlightModel.searchTime([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
                if (data.length) {
                    return responseStandard(res, `List of DetailFlight`, {data, pageInfo})
                } else {
                    return responseStandard(res, `Nothing found here`, {data, pageInfo}, 500, false)
                }
            }
            if (searchKey === 'ticket_price') {
                console.log('true')
                searchKey = 'class.price'
                const data = await detailFlightModel.searchPrice([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
                if (data.length) {
                    return responseStandard(res, `List of DetailFlight`, {data, pageInfo})
                } else {
                    return responseStandard(res, `Nothing found here`, {data, pageInfo}, 500, false)
                }
            }
            const data = await detailFlightModel.getDetailFlight([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
            if (data.length) {
                return responseStandard(res, `List of DetailFlight`, {data, pageInfo})
            } else {
                return responseStandard(res, `Nothing found here`, {data, pageInfo}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    }
}