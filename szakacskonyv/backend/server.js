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
        pool.query(`INSERT INTO users VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.email}', '${req.body.phone}', SHA1('${req.body.password}'), 'user', '1')`, (err, results) => {
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

// felhasználó belépés

app.post('/login', (req, res) =>{
    if(!req.body.email || !req.body.password){
        res.status(203).send('Hiányzó adatok!');
        return;
    }

    pool.query(`SELECT ID, name, email, role FROM users WHERE email = '${req.body.email}' AND password='${CryptoJs.SHA1(req.body.password)}'`, (err, results) =>{
        if (err){
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
          }
          if (results.length == 0){
            res.status(203).send('Hibás belépési adatok!');
            return;
          }
          res.status(202).send(results);
          return;
    });
});

app.listen(port, () => {
    //console.log(process.env) ;
    console.log(`Server listening on port ${port}...`);
});

//felhasznalo modositas
app.patch('/users/:id', logincheck, (req,res) => {
    if (!req.params.id) {
        res.status(203).send('Hiányzó azonosító!');
        return;
    }

    if (!req.body.name || !req.body.email || !req.body.phone) {
        res.status(203).send('Hiányzó adatok!');
        return;
    }

    //ne módosíthassa már meglévő email címre az email címét

    pool.query(`UPDATE users SET name='${req.body.name}', email='${req.body.email}', role='${req.body.role}' WHERE ID='${req.params.id}'`, (err, results) => {
        if (err){
          res.status(500).send('Hiba történt az adatbázis lekérés közben!');
          return;
        }
    
        if (results.affectedRows == 0){
          res.status(203).send('Hibás azonosító!');
          return;
        }
    
        res.status(200).send('Felhasználó adatok módosítva!');
        return;
    });

})

//jelszo modositas
app.patch('/passmod/:id', logincheck, (req, res) => {
  
    if (!req.params.id) {
      res.status(203).send('Hiányzó azonosító!');
      return;
    }
  
    if (!req.body.oldpass || !req.body.newpass || !req.body.confirm) {
      res.status(203).send('Hiányzó adatok!');
      return;
    }
  
     // jelszavak ellenőrzése
     if (req.body.newpass != req.body.confirm){
      res.status(203).send('A megadott jelszavak nem egyeznek!');
      return;
    }
    
    // jelszó min kritériumoknak megfelelés
    if (!req.body.newpass.match(passwdRegExp)){
      res.status(203).send('A jelszó nem elég biztonságos!');
      return;
    }
  
    // megnézzük, hogy jó-e a megadott jelenlegi jelszó
    pool.query(`SELECT password FROM users WHERE ID='${req.params.id}'`, (err, results) => {
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
  
      if (results.length == 0){
        res.status(203).send('Hibás azonosító!');
        return;
      }
  
      if (results[0].password != CryptoJs.SHA1(req.body.oldpass)){
        res.status(203).send('A jelenlegi jelszó nem megfelelő!');
        return;
      }
  
      pool.query(`UPDATE users SET password=SHA1('${req.body.newpass}') WHERE ID='${req.params.id}'`, (err, results) => {
        if (err){
          res.status(500).send('Hiba történt az adatbázis lekérés közben!');
          return;
        }
    
        if (results.affectedRows == 0){
          res.status(203).send('Hibás azonosító!');
          return;
        }
    
        res.status(200).send('A jelszó módosítva!');
        return;
      });
  
    });
  
});

app.get('/users', admincheck, (req, res) => {

  //csak admin joggal lehet 

  pool.query(`SELECT ID, name, email, phone, role FROM users`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }
    res.status(200).send(results);
    return;
  });
});

// bejelentkezés ellenőrzése
function logincheck(req, res, next){
  let token = req.header('Authorization');
  
  if (!token){
    res.status(400).send('Jelentkezz be!');
    return;
  }

  pool.query(`SELECT * FROM users WHERE ID='${token}'`, (err, results) => {
    if (results.length == 0){
      res.status(400).send('Hibás authentikáció!');
      return;
    } 

    next();
  });

  return;
}

// jogosultság ellenőrzése
function admincheck(req, res, next){
  let token = req.header('Authorization');
  
  if (!token){
    res.status(400).send('Jelentkezz be!');
    return;
  }

  pool.query(`SELECT role FROM users WHERE ID='${token}'`, (err, results) => {
    if (results.length == 0){
      res.status(400).send('Hibás authentikáció!');
      return;
    } 
    if (results[0].role != 'admin'){
      res.status(400).send('Nincs jogosultságod!');
      return;
    }
    next();
  });

  return;
}


//user torles ID alapjan
app.delete('/users/:id', logincheck, (req, res) => {
  
  if (!req.params.id) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  pool.query(`DELETE FROM users WHERE ID='${req.params.id}'`, (err, results) => {
    
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }
    
    if (results.affectedRows == 0){
      res.status(203).send('Hibás azonosító!');
      return;
    }

    res.status(200).send('Felhasználó törölve!');
    return;

  });
});

// bejelentkezett felhasználó adatainak lekérése
app.get('/me/:id', logincheck, (req, res) => {
   if (!req.params.id) {
     res.status(203).send('Hiányzó azonosító!');
     return;
   }
 
   pool.query(`SELECT name, email, role FROM users WHERE ID='${req.params.id}'`, (err, results) =>{ 
     if (err){
       res.status(500).send('Hiba történt az adatbázis lekérés közben!');
       return;
     }
 
     if (results.length == 0){
       res.status(203).send('Hibás azonosító!');
       return;
     }
 
     res.status(202).send(results);
     return;
 
   });
});

// felhasználó adatainak lekérése id alapján (CSAK ADMIN)
app.get('/users/:id', logincheck, (req, res) => {

  if (!req.params.id) {
     res.status(203).send('Hiányzó azonosító!');
     return;
   }
 
   pool.query(`SELECT name, email, role FROM users WHERE ID='${req.params.id}'`, (err, results) =>{ 
     if (err){
       res.status(500).send('Hiba történt az adatbázis lekérés közben!');
       return;
     }
 
     if (results.length == 0){
       res.status(203).send('Hibás azonosító!');
       return;
     }
 
     res.status(202).send(results);
     return;
 
   });
 });

 //receptek lekérdezése
app.get('/recipes/:userID', logincheck, (req, res) => {
  if (!req.params.userID) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }

  pool.query(`SELECT * FROM recipes WHERE userID='${req.params.userID}'`, (err, results) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis lekérés közben!');
      return;
    }

    res.status(200).send(results);
    return;

  });

});
 
 //recept felvetel
app.post('/recipes/:userID', logincheck, (req, res) => {

  if (!req.params.userID) {
    res.status(203).send('Hiányzó azonosító!');
    return;
  }
  if (!req.body.title || !req.body.description || !req.body.time || !req.body.additions || !req.body.calorie) {
    res.status(203).send('Hiányzó adatok!');
    return;
  }


    // insert
    pool.query(`INSERT INTO recipes VALUES('${uuid.v4()}', '${0}', '${req.params.userID}', '${req.body.title}', '${req.body.description}', '${req.body.time}', '${req.body.additions}', '${req.body.calorie}')`, (err) => {
      if (err){
        res.status(500).send('Hiba történt az adatbázis művelet közben!');
        return;
      }
  
      res.status(200).send('A recept felvéve!');
      return;
    });

  });

// recept törlése
app.delete('/recipes/:ID/', logincheck, (req, res)=>{
  
  pool.query(`DELETE FROM recipes WHERE('${uuid.v4()}', '${0}', '${req.params.userID}', '${req.body.title}', '${req.body.description}', '${req.body.time}', '${req.body.additions}', '${req.body.calorie}')`, (err) => {
    if (err){
      res.status(500).send('Hiba történt az adatbázis művelet közben!');
      return;
    }

    res.status(200).send('A recept törölve!');
    return;
  });
});