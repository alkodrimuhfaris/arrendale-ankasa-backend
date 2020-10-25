let responseStandard = require('../../helpers/responseStandard')
let paging = require('../../helpers/pagination')

let detailFlightModel = require('../../models/public/searchTicket')
let cityModel = require('../../models/public/city')

module.exports = {
    getDetailFlightById: async (req, res) => {
        let { id } = req.params
        try {
            let result = await detailFlightModel.getDetailFlightByConditions(id)
            if(result.length > 0) {
                return responseStandard(res, `Flight with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'Flight Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 500, false)
        }
    },
    getDetailFlight: async (req, res) => {
        try {
            let countTotalDetailFlight = await detailFlightModel.countDetailFlight()
            let { search, orderBy } = req.query
            const page = paging.pagination(req, countTotalDetailFlight[0].count)
            let { offset=0, pageInfo } = page
            let { limitData: limit=5 } = pageInfo
            let origin = Object.keys(search) ? search.origin : 3
            let destination = Object.keys(search) ? search.destination : 1
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

            let [{city_name:origin_city_name, 
                country_code:origin_city_country}] = await cityModel.getCityCountry(origin)
                
            let [{city_name:destination_city_name, 
                country_code:destination_city_country}] = await cityModel.getCityCountry(destination)            

            if (searchKey === 'departure_time' || searchKey === 'arrived_time') {
                console.log('true')
                console.log(searchValue)
                let result = await detailFlightModel.searchTime([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
                
                if (result.length) {
                    result = result.map(item => {
                        Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
                        return item
                    })
                    return responseStandard(res, `List of Flight`, {result, pageInfo})
                } else {
                    return responseStandard(res, `Nothing found here`, {pageInfo}, 500, false)
                }
            }else if (searchKey === 'price') {
                console.log('true')
                let result = await detailFlightModel.searchPrice([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
                if (result.length) {
                    result = result.map(item => {
                        Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
                        return item
                    })
                    return responseStandard(res, `List of Flight`, {result, pageInfo})
                } else {
                    return responseStandard(res, `Nothing found here`, {pageInfo}, 500, false)
                }
            }

            let result = await detailFlightModel.getDetailFlight([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
            if (result.length) {
                result = result.map(item => {
                    Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
                    return item
                })
                return responseStandard(res, `List of Flight`, {result, pageInfo})
            } else {
                return responseStandard(res, `Nothing found here`, {pageInfo}, 500, false)
            }

        } catch (e) {
            return responseStandard(res, e.message, {}, 500, false)
        }
    }
}