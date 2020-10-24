const table = 'users'
const getFromDB = require('../../helpers/promiseToDB')
let query = ''

module.exports = {
    createResetCode: async (data={}, user, tables=table) => {
        query = `UPDATE 
                 ${tables} 
                 SET ? 
                 WHERE email='${user}'`
        
        return await getFromDB(query, data)                                  
    }
}
