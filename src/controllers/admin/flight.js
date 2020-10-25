
const responseStandard = require('../../helpers/responseStandard')
const joi = require('joi')

const flightModel = require('../../models/admin/flight')
const cityModel = require('../../models/public/city')

module.exports = {
    createFlight: async (req, res) => {
      const schema = joi.object({
        airlines_id: joi.number().required(),
        flight_code: joi.string().required(),
        origin: joi.string().required(),
        destination: joi.string().required(),
        departure_date: joi.string().required(),
        departure_time: joi.string().required(),
        arrived_date: joi.string().required(),
        arrived_time: joi.string().required()
      })
      var { value: results, error } = schema.validate(req.body)
      if (error) {
        return responseStandard(res, 'Error', {error: error.message}, 400, false)
      } else {
        let { name, departure_time } = results
        try {
          let {origin, destination} = results
          let cityOrigin = await cityModel.getCityId(origin)
          if(!cityOrigin.length) {return responseStandard(res, 'City does not exist! create city first!', {}, 400, false)}
          origin = cityOrigin[0].id
          let cityDestination = await cityModel.getCityId(destination)
          if(!cityDestination.length) {return responseStandard(res, 'City does not exist! create city first!', {}, 400, false)}
          destination = cityDestination[0].id

          Object.assign(results, {origin, destination})

          let check = await flightModel.countFlight(departure_time)
          if (check > 0) {
            return responseStandard(res, 'Airline Already Exist', {}, 401, false)
          } else {

            let data = await flightModel.createFlight(results)

            if (data.affectedRows) {
              return responseStandard(res, `Flight Has been Created`, {results}, 200, true)
            } else {
              return responseStandard(res, 'Error to create Flight', {}, 500, false)
            }
          }
        } catch (e) {
          return responseStandard(res, e.message, {}, 401, false)
        }
      }
    },
    getFlight: async (req, res) => {
      try {
          const data = await flightModel.getFlight()
          if (data.length) {
              return responseStandard(res, `List of Flight`, {data})
          } else {
              return responseStandard(res, `Nothing found here`, {data}, 500, false)
          }
      } catch (e) {
          return responseStandard(res, e.message, {}, 401, false)
      }
    },
    getFlightById: async (req, res) => {
        let { id } = req.params
        try {
            const data = await flightModel.getFlightByConditions({ id })
            if(data.length > 0) {
                return responseStandard(res, `Flight with Id ${id}`, {data})
            } else {
                return responseStandard(res, 'Flight Not found', {}, 401, false)
            }
        } catch (e) {
            return responseStandard(res, e.message, {}, 401, false)
        }
    },
    updateFlight: async (req, res) => {
        let { id } = req.params
        id = Number(id)
        const schema = joi.object({
            airlines_id: joi.number(),
            flight_code: joi.string(),
            origin: joi.string(),
            departure_date: joi.string(),            
            departure_time: joi.string(),
            destination: joi.number(),
            arrived_date: joi.string(),
            arrived_time: joi.string()
        })
        var { value: results, error } = schema.validate(req.body)
        if (error) {
            return responseStandard(res, 'Error', {error: error.message}, 400, false)
        } else {
            try {
                if (results.length) {
                  let data = await flightModel.updateFlight(results, id)

                  if (data.affectedRows) {
                      return responseStandard(res, `Flight Has been Updated`, {results}, 200, true)
                  } else {
                      return responseStandard(res, 'Error to update Flight', {}, 500, false)
                  }
                } else {
                  return responseStandard(res, 'U must fill atleast one column', {}, 401, false)
                }
            } catch (e) {
                return responseStandard(res, e.message, {}, 500, false)
            }
        }
    }, 
    deleteFlight: async (req, res) => {
      const { id } = req.params
      let flight_id  = Number(id)
      // console.log(uid)
      try {
        const data = await flightModel.deleteFlight({id: flight_id})
        if(data.affectedRows){
            return responseStandard(res, `Flight Has been deleted`, {})
        } else {
            return responseStandard(res, 'Flight Not found', {}, 401, false)
        }
      } catch (e) {
        return responseStandard(res, e.message, {}, 401, false)
      }
    }
}