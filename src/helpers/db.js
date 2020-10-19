const mysql = require('mysql')
<<<<<<< HEAD
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env
const conn = mysql.createConnection({
=======

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env

const data = {
>>>>>>> 169d6f307032130bb724592233a5469f32a39d07
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
<<<<<<< HEAD
})

conn.connect()

module.exports = conn
=======
}

module.exports = mysql.createConnection(data)
>>>>>>> 169d6f307032130bb724592233a5469f32a39d07
