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
    },
    changePassword: async (password, id, tables=table) => {
        query = `UPDATE 
                ${tables} 
                SET ? 
                WHERE ?`

        return await getFromDB(query, [password, id])
    }
}
