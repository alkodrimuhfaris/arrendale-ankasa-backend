const db = require('../helpers/db')
const table = 'facilities'


module.exports = {
    getFacilitiesByConditions: (data) =>{
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
    getFacilities: () =>{
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
    createFacilities: (data={}) => {
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
    countFacilities: (data) => {
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
    updateFacilities: (data={}, id) => {
        return new Promise((resolve, reject) =>{
            console.log(data)
            db.query(`UPDATE ${table} SET ? WHERE class_id=${id}`, data, (err, result, _fields)=> {
                if(err) {
                    reject(err);
                }else {
                    resolve(result)
                }
            })
        })
    }
}
