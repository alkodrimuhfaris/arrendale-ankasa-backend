const table = 'transit'
const getFromDB = require('../helpers/promiseToDB')
let query = ''

module.exports = {
    getTransitByConditions: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)    
    },
    getTransit: async (tables=table) =>{
        query = `SELECT * 
                 FROM ${tables}`
        
        return await getFromDB(query)                     
    },
    createTransit: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO ${tables} 
                 SET ?`
        
        return await getFromDB(query, data)                     
    },
    countTransit: async (data, tables=table) => {
        query = `SELECT 
                 COUNT(*) 
                 AS count 
                 FROM ${tables} 
                 WHERE name 
                 LIKE '${data}'`
        
        return await getFromDB(query)                                      
    },
    updateTransit: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE id=${id}`
        
        return await getFromDB(query, data)                                                       
    },
    deleteTransit: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)                                                                       
    }
}
