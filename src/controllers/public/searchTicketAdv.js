let responseStandard = require('../../helpers/responseStandard')
let pagination = require('../../helpers/pagination')

let detailFlightModel = require('../../models/public/searchTicketAdv')
let cityModel = require('../../models/public/city')
let joi = require('joi')

module.exports = {
  searchTicket: async (req, res) => {
    path = '/explore/search/flight'
    req.query.search = req.query.search ? req.query.search : {}
    
      let {
        origin = 0,
        destination = 0, 
        departure_time = [0, 0, 0, 0],
        departure_date = '',
        arrived_time = [0, 0, 0, 0],
        arrived_date = '',
        transit = [0, 0, 0],
        facility = [],
        airlines_name = [],
        class_name = '',
        price = [0, 10000]
      } 
        = req.query.search
      
      console.log(price)

      arrived_time = arrived_time.length && arrived_time.map(item => Number(item)).filter((_item, i)=> i<4 )
      departure_time = departure_time.length && departure_time.map(item => Number(item)).filter((_item, i)=> i<4 )
      price = price.length && price.map(item => Number(item)).filter((_item, i)=> i<2 )
      transit = transit.length && transit.map(item => Number(item)).filter((_item, i)=> i<3 )
      airlines_name = (typeof airlines_name === 'string') ? [airlines_name] : airlines_name
      origin = origin && Number(origin)
      destination = destination && Number(destination)

      let data = {
        origin,
        destination, 
        departure_time,
        departure_date,
        arrived_time,
        arrived_date,
        transit,
        facility,
        airlines_name,
        class_name,
        price
      }

    try {
      const {page,limit,limiter} = pagination.pagePrep(req.query)
      let result = await detailFlightModel.searchTicket(data, limiter)
      const [{count}] = await detailFlightModel.searchTicketCount(data) || 0
      if(result.length > 0) {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        let newResult = []
          for (let item of result){
            let [{city_name:origin_city_name, 
              country_code:origin_city_country}] = await cityModel.getCityCountry(item.origin)
            let [{city_name:destination_city_name, 
              country_code:destination_city_country}] = await cityModel.getCityCountry(item.destination)  
            Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
            newResult.push(item)
          }
        return responseStandard(res, `List of Flight`, {result:newResult, pageInfo})
      } else {
        const pageInfo = pagination.paging(count, page, limit, path, req)
        return responseStandard(res, 'Flight Not found', {}, 401, false)
      }
    } catch (e) {
      console.log(e)
      return responseStandard(res, e.message, {}, 500, false)
    }
  },
  getDetailFlight: async (req, res) => {
    try {
      let {id:flight_detail_id} = req.params
      let result = await detailFlightModel.searchTicketById(flight_detail_id)
      if(result.length > 0) {
        let newResult = []
          for (let item of result){
            let [{city_name:origin_city_name, 
              country_code:origin_city_country}] = await cityModel.getCityCountry(item.origin)
            let [{city_name:destination_city_name, 
              country_code:destination_city_country}] = await cityModel.getCityCountry(item.destination)  
            Object.assign(item, {origin_city_name, origin_city_country, destination_city_name, destination_city_country})
            newResult.push(item)
          }
        return responseStandard(res, `List of Flight`, {result:newResult})
      } else {
        return responseStandard(res, 'Flight Not found', {})
      }
    } catch (e) {
      console.log(e)
      return responseStandard(res, e.message, {}, 500, false)
    }
  }
}