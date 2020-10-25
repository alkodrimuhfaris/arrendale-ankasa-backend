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
                return responseStandard(res, `Flight with Id ${id}`, {result})
            } else {
                return responseStandard(res, 'Flight Not found', {}, 401, false)
            }
        } catch (e) {
            console.log(e)
            return responseStandard(res, e.message, {}, 500, false)
        }
    },
    getDetailFlight: async (req, res) => {
        // let {id:user_id} = req.user ? req.user : 0
        // if (!req.user && !user_id) {return responseStandard(res, 'Log-in first to see the content!', {}, 403, false)}
        try {
            let countTotalDetailFlight = await detailFlightModel.countDetailFlight()
            let { search, orderBy } = req.query
            const page = paging.pagination(req, countTotalDetailFlight[0].count)
            let { offset=0, pageInfo } = page
            let { limitData: limit=5 } = pageInfo

            if (search){
                let destination = search.destination ? search.destination : 0
                let cityActivity = {city_id: search.destination, search_counter:1}
                destination && await cityModel.addCityActivity(cityActivity)
            }

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
                    return responseStandard(res, `List of DetailFlight`, {result:newResult, pageInfo})                        
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
                    return responseStandard(res, `List of DetailFlight`, {result:newResult, pageInfo})        
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
                return responseStandard(res, `List of DetailFlight`, {result:newResult, pageInfo})    
            } else {
                return responseStandard(res, `Nothing found here`, {pageInfo}, 500, false)
            }

        } catch (e) {
            return responseStandard(res, e.message, {}, 500, false)
        }
    }
}