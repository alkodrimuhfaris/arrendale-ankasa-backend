const table = 'class'
const getFromDB = require('../helpers/promiseToDB')
let query = ''


module.exports = {
    getClassFlightByConditions: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM ${tables} 
                 WHERE ?`
                 
        return await getFromDB(query, data)
    },
    getClassFlight: async (tables=table) =>{
        query = `SELECT * 
                 FROM ${tables}`
        
        return await getFromDB(query)
    },
    createClassFlight: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO ${tableS} 
                 SET ?`
                 
        return await getFromDB(query, data)
    },
    countClassFlight: async (data, tables=table) => {
        query = `SELECT 
                 COUNT(*) 
                 AS count 
                 FROM ${tables} 
                 WHERE name LIKE '${data[0]}'`
                 
        return await getFromDB(query)
    },
    updateClassFlight: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} SET ? 
                 WHERE id=${id}`
        
        return await getFromDB(query, data)
    },
    deleteClassFlight: async (data, tables=table) => {
        query = `DELETE
                 FROM 
                 ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)
    }
}
