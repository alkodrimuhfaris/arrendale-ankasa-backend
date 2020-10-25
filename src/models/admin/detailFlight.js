const table = 'flight_detail'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''


module.exports = {
    getFlightDetailByConditions: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM ${tables} 
                 WHERE ?`
                 
        return await getFromDB(query, data)
    },
    getFlightDetail: async (limiter, tables=table) =>{
        query = `SELECT * 
                 FROM ${tables}
                 ${limiter}`
        
        return await getFromDB(query)
    },
    countFlightDetail: async (tables=table) => {
        query = `SELECT 
                 COUNT(*) 
                 AS count
                 FROM ${tables}`
        return await getFromDB(query)
    },
    createFlightDetail: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO ${tables} 
                 SET ?`
                 
        return await getFromDB(query, data)
    },
    updateFlightDetail: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} SET ? 
                 WHERE ?`
        
        return await getFromDB(query, [data, id])
    },
    deleteFlightDetail: async (data, tables=table) => {
        query = `DELETE
                 FROM 
                 ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)
    }
}
