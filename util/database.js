const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'db',
  user: 'nodejs',
  database: 'nodejs',
  password: 'nodejs'
})

module.exports = pool.promise()
