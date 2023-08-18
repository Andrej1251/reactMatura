// Create a connection to the MySQL server
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root' // Replace with your MySQL password
});
