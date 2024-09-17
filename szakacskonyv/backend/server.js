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

//user registration
app.post('/reg', (req, res) => {

    //adat ellenorzes
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.confirm ) {
        res.status(203).send('Nem adtál meg minden kötelező adatot!');
        return;
    }

    //jelszavak ellenőrzése
    if (req.body.password != req.body.confirm){
        res.status(203).send('A megadott jelszavak nem egyeznek!');
        return;
    }

    //jelszó kritérimuainak valo megfelelés
    if(!req.body.password.match(passwdRegExp)) {
        res.status(203).send('A jelszó nem elég biztonságos!');
        return;
    }

    //email ellenőrzés
    pool.query(`SELECT * FROM users WHERE email= '${req.body.email}'`, (err, results) => {
        if(err) {
            res.status(500).send('Hiba történt az adatbázis elérése közben');
            return;
        }

        //már létező email
        if(results.length !=0) {
            res.status(203).send('A megadott email már regiszrálva van!');
            return;
        }

        //új user felvétel
        pool.query(`INSERT INTO users VALUES('${uuid.v4()}', ${req.body.name}, ${req.body.email}, SHA1('${req.body.password}'), 'user')`, (err, results) => {
            if(err) {
                res.status(500).send('Hiba az adatbázis elérése közben');
                return;
            }

            res.status(203).send('Sikeres regisztráció!');
            return;
        });
        return;
    });

});
