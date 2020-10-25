const table = 'city'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''

module.exports = {
    getCityByConditions: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM 
                 ${tables} 
                 WHERE ?`

        return await getFromDB(query, data)
    },
    getCity: async (limiter, tables=table) =>{
        query = `SELECT * 
                 FROM 
                 ${tables}
                 ${limiter}`
                
        return await getFromDB(query)
    },
    getCityCount: async (tables=table) =>{
        query = `SELECT count(*) as count
                 FROM 
                 ${tables}`
                
        return await getFromDB(query)
    },
    createCity: async (data={}, tables=table) => {
        query = `INSERT 
                 INTO 
                 ${tables} 
                 SET ?`
        
        return await getFromDB(query, data)
    },
    countCity: async (data, tables=table) => {
        console.log(data)
        query = `SELECT 
                 COUNT(*) 
                 AS count 
                 FROM ${tables} 
                 WHERE 
                 city_name 
                 LIKE 
                 '${data[0]}' 
                 AND 
                 country_name 
                 LIKE 
                 '${data[1]}'`
        
        return await getFromDB(query)
    },
    updateCity: async (data={}, id, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE 
                 id=${id}`

        return await getFromDB(query, data)
    },
    deleteCity: async (data, tables=table) => {
        query = `DELETE 
                 FROM ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)
    }
}
