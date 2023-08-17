const express = require('express');
const moment = require('moment');

// Create a new Express application
const app = express();

var intervalStop;
function updateFreq(updateF){
    if(updateF!=0){
        if(intervalStop){
            clearInterval(intervalStop);
        }
        intervalStop = setInterval(() => {
            //update db
            //console.log(updateF);
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

app.post('/api/freq', (req, res) => {
    try{
        updateFreq(req.body.updateFreq);
        res.status(200).json({data:'Updated frequecy'});
    }catch(e){
        res.status(500).json({data:'Failed to update frequecy: '+e});
    }
});
app.post('/api/newID', (req, res) => {
    try{
        if(req.body.id!==""){
            //update db
            res.status(200).json({data:'Updated id'});
        }else{
            throw 'Invalid id';
        }
        
    }catch(e){
        res.status(500).json({data:'Failed to update id: '+e});
    }
});
app.listen(3001, () => console.log('API running port 3001.'));