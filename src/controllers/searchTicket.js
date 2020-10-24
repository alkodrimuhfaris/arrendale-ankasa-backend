let responseStandard = require('../helpers/responseStandard')
let paging = require('../helpers/pagination')

let detailFlightModel = require('../models/detailFlight')
let cityModel = require('../models/city')

module.exports = {
    getDetailFlightById: async (req, res) => {
        let { id } = req.params
        try {
            let result = await detailFlightModel.getDetailFlightByConditions(id)
            if(result.length > 0) {
                return responseStandard(res, `DetailFlight with Id ${id}`, {result})
            } else {
                return responseStandard(res, 'DetailFlight Not found', {}, 401, false)
            }
        } catch (e) {
            console.log(e)
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
                // if(search.origin || search.destination){
                //     let resultOrigin = await cityModel.getCityId(search.origin)
                //     if(!resultOrigin.length){return responseStandard(res, 'Flight not found', {}, 401, false)}
                //     let [{id:origin_id}] = resultOrigin
                //     let resultDestination = await cityModel.getCityId(search.destination)
                //     if(!resultDestination.length){return responseStandard(res, 'Flight not found', {}, 401, false)}
                //     let [{id:destination_id}] = resultDestination
                //     origin = origin_id
                //     destination = destination_id
                //     Object.assign(search, {origin:origin_id, destination:destination_id})
                // }
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
                let result = await detailFlightModel.searchTime([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
                
                if (result.length) {
                    let newResult = []
                    for (let item of result){
                        let [{city_name:origin_city_name, 
                            country_code:origin_city_country}] = await detailFlightModel.getCityCountry(item.origin)
                        let [{city_name:destination_city_name, 
                            country_code:destination_city_country}] = await detailFlightModel.getCityCountry(item.destination)  
                        Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
                        newResult.push(item)
                    }
                    return responseStandard(res, `List of DetailFlight`, {newResult, pageInfo})                        
                } else {
                    return responseStandard(res, `Nothing found here`, {pageInfo}, 500, false)
                }
            }else if (searchKey === 'price') {
                console.log('true')
                let result = await detailFlightModel.searchPrice([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
                if (result.length) {
                    let newResult = []
                    for (let item of result){
                        let [{city_name:origin_city_name, 
                            country_code:origin_city_country}] = await detailFlightModel.getCityCountry(item.origin)
                        let [{city_name:destination_city_name, 
                            country_code:destination_city_country}] = await detailFlightModel.getCityCountry(item.destination)  
                        Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
                        newResult.push(item)
                    }
                    return responseStandard(res, `List of DetailFlight`, {newResult, pageInfo})        
                } else {
                    return responseStandard(res, `Nothing found here`, {pageInfo}, 500, false)
                }
            }

            let result = await detailFlightModel.getDetailFlight([searchKey, searchValue, orderByKey, orderByValue, limit, offset])
            if (result.length) {
                let newResult = []
                console.log(result)
                for (let item of result){
                    let [{city_name:origin_city_name, 
                        country_code:origin_city_country}] = await detailFlightModel.getCityCountry(item.origin)
                    let [{city_name:destination_city_name, 
                        country_code:destination_city_country}] = await detailFlightModel.getCityCountry(item.destination)  
                    Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
                    newResult.push(item)
                }
                return responseStandard(res, `List of DetailFlight`, {newResult, pageInfo})    
            } else {
                return responseStandard(res, `Nothing found here`, {pageInfo}, 500, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 500, false)
        }
    }
}