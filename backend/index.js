const express = require('express');
const cors = require('cors');
const {Client} = require('pg');
const parse = require('pg-connection-string').parse;
const app = express();
const crypto = require('crypto').webcrypto;
app.use(express.json())
const corsOptions = {
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))
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
    try{
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
    }
    catch(err) {
        res.status(500).send(err);
    }
});

const generateToken = async (uid,publickey) => {
    publickey = JSON.parse(publickey.toString());
    arr = new Int8Array(32);
    crypto.getRandomValues(arr);
    checktokens[uid] = Buffer.from(arr).toString('base64');
    publickey = await crypto.subtle.importKey("jwk",publickey,{
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },true,['encrypt']);
    encrypted_token = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }
    ,publickey,arr);
    return Buffer.from(encrypted_token).toString('base64');
};

const validateToken = (uid,token) => {
    if(checktokens[uid] == token){
        validtokens[token] = uid;
        checktokens[uid]=undefined;
        return true;
    }
    return false;
};

app.get('/loginReq',(req,res) => {
    let uid = req.query.uid;
    db.query("SELECT * FROM userdetails WHERE username=$1",[uid]).then(
        (result,err) => {
            if(err) res.status(500).send(err);
            else if(result.rows.length==0) res.status(500).send("No such User");
            else generateToken(uid,result.rows[0].publickey).then((data) => {
                result.rows[0].publickey = Buffer.from(result.rows[0].publickey).toString('Base64');
                result.rows[0].privatekey = Buffer.from(result.rows[0].privatekey).toString('Base64');
                res.send([result.rows[0],data])
            });
        }
    );
});

app.post('/loginRes',(req,res) => {
    let uid = req.body.uid;
    let token = req.body.token;
    if(validateToken(uid,token)){
        res.send(true);
    }
    else res.status(500).send("Invalid Response");
});

const checkValidUser = (uid,token) => {
    return validtokens[token] == uid;
};

app.post('/message',(req,res) => {

});

app.post('/chatsync',(req,res) => {

});

app.get('/test',(req,res) => {
    generateToken();
    res.send(":D");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});