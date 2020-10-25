const table = 'users'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''

module.exports = {
    getAllUser: async (tables=table) =>{
        query = `SELECT * 
                 FROM 
                 ${tables}
                 WHERE
                 role_id=${1}`
        
        return await getFromDB(query)                 
    },
    getDetailProfile: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM 
                 ${tables} 
                 WHERE ?
                 AND 
                 role_id=${1}`
        
        return await getFromDB(query, data)                 
    },
    searchUsers: async (data, tables=table) => {
        query = `SELECT * 
                 FROM ${tables}
                 WHERE role_id=${1} AND ${data[0]} 
                 LIKE '%${data[1]}%'
                 ORDER BY ${tables}.${data[2]}
                 ${data[3]} LIMIT ${data[4]}
                 OFFSET ${data[5]}`
                 
        return await getFromDB(query)
    },
    countUser: async (data, tables=table) => {
        query = `SELECT COUNT(*)
                 AS count
                 FROM ${tables}`

        return await getFromDB(query)
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
