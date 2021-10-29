const express = require('express');
const {Client} = require('pg');
const parse = require('pg-connection-string').parse;
const app = express()
app.use(express.json())
const dotenv = require('dotenv');
const port = 5000;
dotenv.config();
var db = new Client(parse(process.env.DB_URL));
db.connect().then(
    (res,err) => {
        if(err) console.log("err",err);
    }
);

validtokens = {};
checktokens = {};

app.post('/register',(req,res) => {
    let name = req.body.name;
    let uid = req.body.uid;
    let private = req.body.private;
    let public = req.body.public;
    db.query("INSERT INTO userdetails VALUES($1,$2,$3,$4)",[uid,name,private,public]).then(
        (result,err) => {
            if(err) res.status(500).send(err);
        }
    );
    res.send("OK");
});

const generateToken = (uid,publickey) => {
    
};

const validateToken = (uid,token) => {

};

app.get('/loginReq',(req,res) => {
    let uid = req.query.uid;
    db.query("SELECT * FROM userdetails WHERE username=$1",[uid]).then(
        (result,err) => {
            if(err) res.status(500).send(err);
            else if(result.rows.length()==0) res.status(500).send("No such User");
            else res.send([rows[0],generateToken(uid,rows[0].publickey.data)]);
        }
    );
});

app.post('loginRes',(req,res) => {
    let uid = req.body.uid;
    let token = req.body.token;
    if(validateToken(uid,token)){
        
    }
    else res.status(500).send("Invalid Response");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});