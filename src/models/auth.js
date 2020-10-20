const table = 'users'
const getFromDB = require('../helpers/promiseToDB')
let query = ''

module.exports = {
    checkUserExist: async (data, tables=table) =>{
        query = `SELECT * 
                 FROM ${tables}
                 WHERE ?`
                
        return await getFromDB(query, data)
    },
    signUp: async (data={}, tables=table) => {
        query = `INSERT INTO ${tables} SET ?`

        return await getFromDB(query, data)
    }
}
