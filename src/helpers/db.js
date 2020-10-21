const mysql = require('mysql')

const data = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
}

module.exports = mysql.createConnection(data)
