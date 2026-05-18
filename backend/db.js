const sql = require('mssql')

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,

  options: {
    instanceName: process.env.DB_INSTANCE,
    encrypt: false,
    trustServerCertificate: true
  }
}

const pool = new sql.ConnectionPool(config)
const poolConnect = pool.connect()

module.exports = {
  sql,
  pool,
  poolConnect
}