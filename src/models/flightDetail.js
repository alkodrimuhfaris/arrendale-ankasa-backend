const db = require('../helpers/db')
const table = 'flight'


module.exports = {
    getDetailFlightByConditions: (data) =>{
        return new Promise((resolve, reject) =>{
            db.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result, _fields)=>{
                // console.log(data)
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    },
    getDetailFlight: () =>{
        return new Promise((resolve, reject) =>{
            db.query(`SELECT * FROM ${table}`, (err, result, _fields)=>{
                // console.log(data)
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    },
    createDetailFlight: (data={}) => {
        return new Promise((resolve, reject) =>{
            console.log(data)
            db.query(`INSERT INTO ${table} SET ?`, data, (err, result, _fields)=> {
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    },
    countDetailFlight: (data) => {
        return new Promise((resolve, reject) =>{
            db.query(`SELECT COUNT(*) as count FROM ${table} WHERE name LIKE '${data}'`, (err, result, _fields) =>{
                if(err) {
                    reject(err);
                }else {
                    resolve(result[0].count);
                }
            })
        }
        )
    },
    updateDetailFlight: (data={}, id) => {
        return new Promise((resolve, reject) =>{
            console.log(data)
            db.query(`UPDATE ${table} SET ? WHERE id=${id}`, data, (err, result, _fields)=> {
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    }
}
