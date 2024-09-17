require('dotenv').config();
const express = require('express');
var mysql = require('mysql');
const uuid = require('uuid');
var cors = require('cors');
var CryptoJs = require("crypto-js");
var moment = require('moment');

const app = express();
const port = process.env.PORT;
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


var pool = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host : process.env.DBHOST,
    user : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    database : process.env.DBNAME
});

//get API version
app.get('/', (req, res ) => {
    res.send(`API version : ${process.env.VERSION}`);
});
