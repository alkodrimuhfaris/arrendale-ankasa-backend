const db = require('../helpers/db')
const table = 'airlines'


module.exports = {
    getAirlinesByConditions: (data) =>{
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
    getAirlines: () =>{
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
    createAirlines: (data={}) => {
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
    countAirlines: (data) => {
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
    updateAirlinePartial: (data={}, id) => {
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
