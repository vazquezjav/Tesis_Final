//import cors from 'cors';


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
 
app.use(cors({
    origin:'*',
    //allowedHeaders: true
   // methods:['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));  

// Configurar cabeceras y cors
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/

// routes

const userRoute = require('./api/routes/user')
app.use('/user',userRoute);

module.exports = app;

