const table = 'users'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''

module.exports = {
    checkUserExist: async (data, tables=table) =>{
        console.log(data)
        query = `SELECT * 
                 FROM ${tables}
                 WHERE ?`
                
        return await getFromDB(query, data)
    },
    signUp: async (data={}, tables=table) => {
        query = `INSERT INTO ${tables} SET ?`

        return await getFromDB(query, data)
    },
    forgotPassword: async (data={}, uid, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE id=${uid}`
        
        return await getFromDB(query, data)                                  
    },
    updateUser: async (data={}, user_id={}, tables=table) => {
        query = `UPDATE ${tables}
                SET ?
                WHERE ?`

        return await getFromDB(query, [data, user_id])
    }
}
