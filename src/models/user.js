const db = require('../helpers/db')
const table = 'users'


module.exports = {
    checkUserExist: (data) =>{
        return new Promise((resolve, reject) =>{
            db.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result, _fields)=>{
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    }
}
