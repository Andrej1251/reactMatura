const express = require('express');
const moment = require('moment');

// Create a connection to the MySQL server
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root' // Replace with your MySQL password
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    //select database
    const databaseName = 'new_database';
    const useDatabaseQuery = `USE ${databaseName}`;
    connection.query(useDatabaseQuery, (err, result) => {
        if (err) {
            console.error('Error selecting database:', err);
        } else {
            console.log(`Database '${databaseName}' selected`);
        }
    });   
});
/*
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
            id INT PRIMARY KEY AUTO_INCREMENT,
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
});*/


// Create a new Express application
const app = express();
var allShapes = [];


var intervalStop;
function updateFreq(updateF,res){
    if(updateF!=0){
        if(intervalStop){
            clearInterval(intervalStop);
        }
        intervalStop = setInterval(() => {
            //go to db end get lora idLora
            const selectLoraQuery = 'SELECT idLora FROM lora';
            connection.query(selectLoraQuery, (err, result) => {
                
                if (err) {
                    console.error('Error selecting lora:', err);
                } else {
                    for(var i=0;i<result.length;i++){
                        //get random values for now RUN LORA in reality
                        var tem = Math.random() * (40 - 20) + 20;
                        var hum = Math.random() * (100 - 0) + 0;
                        var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
                        //insert into table val
                        const insertValQuery = `INSERT INTO val (tem,hum,datetime,humTempFK) VALUES (${tem},${hum},"${datetime}",${result[i].idLora})`;
                        var b={};
                        b.idLora=result[i].idLora;
                        b.temp=tem;
                        b.humd=hum;
                        b.datetime=datetime;
                        connection.query(insertValQuery, (err, result) => {
                            if (err) {
                                console.error('Error inserting new value:', err);
                            } 
                        });
                        allShapes.push(b);
                        //console.log("=====================================")
                    }
                }
                
            });
        }, updateF);
    }
}

updateFreq(0);
// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify allowed HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//server side event
app.get('/subscribe', (req, res) => {
    console.log('New client connected!');
    res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
    });
    // Send a subsequent message every five seconds
    setInterval(() => {
        for(var i=0;i<allShapes.length;i++){
            //console.log(allShapes[i]);
            res.write(`data: ${JSON.stringify(allShapes[i])}`);
            res.write('\n\n');
        }
        allShapes=[];
    }, 1000);

    req.on('close', () => res.end('OK'))
});

app.post('/api/freq', (req, res) => {
    try{
        updateFreq(req.body.updateFreq,res);
        res.status(200).json({data:'Updated frequecy'});
    }catch(e){
        res.status(500).json({data:'Failed to update frequecy: '+e});
    }
});
app.post('/api/history', (req, res) => {
    try{
        var selectLoraQuery;
        if(req.body.id==-1) selectLoraQuery= 'SELECT * FROM val WHERE datetime BETWEEN "'+req.body.from+'" AND "'+req.body.to+'"';   
        else selectLoraQuery= 'SELECT * FROM val WHERE datetime BETWEEN "'+req.body.from+'" AND "'+req.body.to+'" AND humTempFK='+req.body.id;
        connection.query(selectLoraQuery, (err, result) => {
            if (err) {
                console.error('Error selecting history:', err);
                res.status(500).json({data:'Failed to select history: '+err});
            } else {
                res.status(200).json({data:result});
            }
        });
        
    }catch(e){
        res.status(500).json({data:'Failed to update history: '+e});
    }
});

app.post('/api/newID', (req, res) => {
    try{
        if(req.body.id!==""){
            //insert into table lora
            try{
                const insertLoraQuery = `INSERT INTO lora (idLora,name) VALUES (${req.body.id},"${req.body.name}") ON DUPLICATE KEY UPDATE name="${req.body.name}"`;
                connection.query(insertLoraQuery, (err, result) => {
                    if (err) {
                        console.error('Error inserting new id:', err);
                        res.status(500).json({data:'Failed to insert new id: '+err});
                    } else {
                        console.log(`New id inserted`);
                        res.status(200).json({data:'Updated id'});
                    }
                });
            }catch(e){
                res.status(500).json({data:'Failed to update id: '+e});
            }
            
        }else{
            throw 'Invalid id';
        }
        
    }catch(e){
        res.status(500).json({data:'Failed to update id: '+e});
    }
});

  
app.listen(3001, () => console.log('API running port 3001.'));
