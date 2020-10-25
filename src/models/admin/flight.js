const table = 'flight'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''


module.exports = {
  getCity: async (cityId, tables='city') => {
    query = `SELECT *
            FROM ${tables}
            WHERE id = ?`
    return await getFromDB(query, cityId)
  },
  getFlightDetail: async (data) => {
    query = `SELECT *
            FROM flight_detail
            WHERE ?`
    return await getFromDB(query, data)
  },
  getFlightByConditions: async (data, tables=table) =>{
      query = `SELECT 
               * FROM 
               ${tables} 
               WHERE ?`
      
      return await getFromDB(query, data)
  },
  getFlight: async (tables=table) =>{
      query = `SELECT * 
               FROM ${tables}`
      
      return await getFromDB(query)
  },
  createFlight: async (data={}, tables=table) => {
      query = `INSERT 
               INTO ${tables} 
               SET ?`
      
      return await getFromDB(query, data)
  },
  countFlight: async (data, tables=table) => {
      query = `SELECT 
               COUNT(*) 
               AS count 
               FROM ${tables} 
               WHERE 
               departure_time = '${data}'`
               
      return await getFromDB(query)
  },
  updateFlight: async (data={}, id, tables=table) => {
      query = `UPDATE 
               ${tables} 
               SET ? 
               WHERE id=${id}`

        return await getFromDB(query, data)                
    },
    deleteFlight: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)                                 
    }
}
