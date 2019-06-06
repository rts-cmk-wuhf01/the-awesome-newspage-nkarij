const mysql = require('mysql2/promise'); // mysql

module.exports = {
   connect: async function () {
      return await mysql.createConnection({
         host: 'localhost',
         user: 'root',
         // min server har ikke et password
         password: '',
         port: '3306',
         database: 'testdatabase'
      })
   }
}