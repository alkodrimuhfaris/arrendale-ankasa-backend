const table = 'destination_list'
const getFromDB = require('../helpers/promiseToDB')
let query = ''

module.exports = {
    getDestinationByConditions: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM 
                 ${tables} 
                 WHERE ?`

        return await getFromDB(query, data)
    },
    getDestination: async (tables=table) =>{
        query = `SELECT * 
                 FROM 
                 ${tables}`
                
        return await getFromDB(query)
    },
    createDestination: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO 
                 ${tables} 
                 SET ?`
        
        return await getFromDB(query, data)
    },
    countDestination: async (data, tables=table) => {
        query = `SELECT 
                 COUNT(*) 
                 AS count 
                 FROM ${tables} 
                 WHERE 
                 name 
                 LIKE 
                 '${data[0]}' 
                 AND 
                 nation 
                 LIKE 
                 '${data[1]}'`
        
        return await getFromDB(query)
    },
    updateDestination: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE 
                 id=${id}`

        return await getFromDB(query, data)
    },
    deleteDestination: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)
    }
}
