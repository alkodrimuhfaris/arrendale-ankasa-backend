const table = 'facilities'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''

module.exports = {
    getFacilityByConditions: async (data, tables=table) =>{
        query = `SELECT 
                 * FROM 
                 ${tables}
                 WHERE ?`
        
        return await getFromDB(query, data)
    },
    getFacility: async (tables=table) =>{
        query = `SELECT 
                 * FROM 
                 ${tables}`
        
        return await getFromDB(query)
    },
    createFacility: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO 
                 ${tables} 
                 SET ?`
        
        return await getFromDB(query, data)
    },
    countFacility: async (data, tables=table) => {
        query = `SELECT 
                 COUNT(*) 
                 AS count 
                 FROM ${tables} 
                 WHERE name 
                 LIKE '${data}'`
        
        return await getFromDB(query)
    },
    updateFacility: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE 
                 id=${id}`

        return await getFromDB(query, data)
    },
    deleteFacility: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)
    }
}
