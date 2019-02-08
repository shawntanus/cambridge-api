'user strict';
var mysql = require('mysql')

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'cambridge',
    password : 'c',
    database : 'cambridge'
  })

connection.connect()

module.exports = connection;