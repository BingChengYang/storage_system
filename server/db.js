var mysql = require('mysql');
var connConfig = require('./config/connConfig.json');
var connection = mysql.createConnection({
    host     : connConfig.host,
    user     : connConfig.user,
    password : connConfig.password,
    database : connConfig.database
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;