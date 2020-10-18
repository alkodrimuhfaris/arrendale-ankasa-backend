const db = require('../helpers/db')
const table = 'destination_list'


module.exports = {
    getDestinationByConditions: (data) =>{
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
    getDestination: () =>{
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
    createDestination: (data={}) => {
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
    countDestination: (data) => {
        return new Promise((resolve, reject) =>{
            db.query(`SELECT COUNT(*) as count FROM ${table} WHERE name LIKE '${data[0]}' AND nation LIKE '${data[1]}'`, (err, result, _fields) =>{
                if(err) {
                    reject(err);
                }else {
                    resolve(result[0].count);
                }
            })
        }
        )
    },
    updateDestination: (data={}, id) => {
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
