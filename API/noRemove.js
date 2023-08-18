// Create a connection to the MySQL server
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root' // Replace with your MySQL password
});
