// Create a connection to the MySQL server
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root' // Replace with your MySQL password
});

// Connect to the MySQL server
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL server');
    //DROP OLD DATABASE
    const dropDatabaseQuery = 'DROP DATABASE IF EXISTS new_database';
    connection.query(dropDatabaseQuery, (err, result) => {
        if (err) {
            console.error('Error dropping database:', err);
        } else {
            console.log('Database dropped');
        }
    });
    //Create database
    const databaseName = 'new_database';
    const createDatabaseQuery = `CREATE DATABASE ${databaseName}`;
    connection.query(createDatabaseQuery, (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
        } else {
            console.log(`Database '${databaseName}' created`);
        }
    });
    //select database
    const useDatabaseQuery = `USE ${databaseName}`;
    connection.query(useDatabaseQuery, (err, result) => {
        if (err) {
            console.error('Error selecting database:', err);
        } else {
            console.log(`Database '${databaseName}' selected`);
        }
    });   
    
    // Create the first table
    const createLoraQuery = `
        CREATE TABLE lora (
            idLora INT PRIMARY KEY,
            name VARCHAR(255) UNIQUE
        )
    `;

    connection.query(createLoraQuery, (err) => {
        if (err) {
            console.error('Error creating table lora:', err);
        } else {
            console.log('Table lora created');
        }
    });
    // Create the second table
    const createValuesQuery = `
        CREATE TABLE val (
            id INT PRIMARY KEY,
            tem FLOAT,
            hum FLOAT,
            datetime DATETIME,
            humTempFK INT,
            FOREIGN KEY (humTempFK) REFERENCES lora(idLora)
        )
    `;

    connection.query(createValuesQuery, (err) => {
        if (err) {
            console.error('Error creating table val:', err);
        } else {
            console.log('Table val created');
        }
    });
});
