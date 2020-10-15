<<<<<<< HEAD
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
    }
}
=======
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
    }
}
>>>>>>> 9165feeb50354381da006e2ff4f6ade3ebbe85b5
