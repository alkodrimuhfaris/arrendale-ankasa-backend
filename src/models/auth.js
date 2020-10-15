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
    },
    signUp: (data={}) => {
        return new Promise((resolve, reject) =>{
            console.log(data)
            db.query('INSERT INTO users SET ?', data, (err, result, _fields)=> {
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    },
    updatePhoto: (data={}, uid) => {
        return new Promise((resolve, reject) =>{
            console.log(data)
            db.query(`UPDATE ${table} SET ? WHERE id=${uid}`, data, (err, result, _fields)=> {
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    }
}
