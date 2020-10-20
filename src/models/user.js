const table = 'users'
const getFromDB = require('../helpers/promiseToDB')
let query = ''

module.exports = {
    getDetailProfile: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM 
                 ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)                 
    },
    updateUser: async (data={}, uid, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE id=${uid}`
        
        return await getFromDB(query, data)                                  
    },
    deleteUser: async (data, tables=table) => {
        query = `DELETE 
                 FROM 
                 ${tables} 
                 WHERE ?`
        
        return await getFromDB(query, data)                                  
    }
}
