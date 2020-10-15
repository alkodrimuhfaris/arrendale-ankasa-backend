<<<<<<< HEAD
const db = require('../helpers/db')
const table = 'users'


module.exports = {
    getDetailProfile: (data) =>{
        return new Promise((resolve, reject) =>{
            db.query('SELECT * FROM users WHERE ?', data, (err, result, _fields)=>{
                // console.log(data)
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    },
    updateUser: (data={}, uid) => {
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
=======
const db = require('../helpers/db')
const table = 'users'


module.exports = {
    getDetailProfile: (data) =>{
        return new Promise((resolve, reject) =>{
            db.query('SELECT * FROM users WHERE ?', data, (err, result, _fields)=>{
                // console.log(data)
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    },
    updateUser: (data={}, uid) => {
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
>>>>>>> 9165feeb50354381da006e2ff4f6ade3ebbe85b5
