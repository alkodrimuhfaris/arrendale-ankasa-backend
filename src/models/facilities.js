const table = 'facilities'
const getFromDB = require('../helpers/promiseToDB')
let query = ''

module.exports = {
    getFacilitiesByConditions: async (data, tables=table) =>{
        query = `SELECT 
                 * FROM 
                 ${tables}
                 WHERE ?`
        
        return await getFromDB(query, data)
    },
    getFacilities: async (tables=table) =>{
        query = `SELECT 
                 * FROM 
                 ${tables}`
        
        return await getFromDB(query)
    },
    createFacilities: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO 
                 ${tables} 
                 SET ?`
        
        return await getFromDB(query, data)
    },
    countFacilities: async (data, tables=table) => {
        query = `SELECT 
                 COUNT(*) 
                 AS count 
                 FROM ${tables} 
                 WHERE name 
                 LIKE '${data}'`
        
        return await getFromDB(query)
    },
    updateFacilities: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE 
                 class_id=${id}`

        return await getFromDB(query, data)
    },
    deleteFacilities: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)
    }
}
