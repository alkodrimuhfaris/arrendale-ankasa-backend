const table = 'airlines'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''

module.exports = {
    getAirlinesByConditions: async (data={}, tables=table) =>{
        query = `SELECT * 
                 FROM ${tables} 
                 WHERE ?`
                 
        return await getFromDB(query, data)
    },
    getAirlines: async (tables=table) =>{
        query = `SELECT *
                 FROM ${tables}`
    
        return await getFromDB(query)
    },
    createAirlines: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO ${tables}
                 SET ?`

        return await getFromDB(query, data)
    },
    countAirlines: async (data, tables=table) => {
        query = `SELECT COUNT(*) as count
                 FROM ${tables}
                 WHERE name 
                 LIKE '${data}'`
        
        return await getFromDB(query)
    },
    updateAirlinePartial: async (data={}, id, tables=table) => {
        query = `UPDATE ${tables}
                 SET ? 
                 WHERE id=${id}`
        
        return await getFromDB(query, data)
        
    },
    deleteAirlines: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables}
                 WHERE ?`
        
        return await getFromDB(query, data)
    }
}
