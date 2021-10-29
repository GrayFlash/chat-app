import React from 'react';
import {Link} from "react-router-dom";
import RegistrationForm from "../forms/RegistrationForm";
import axios from 'axios';

class RegistrationPage extends React.Component{

//Gets the data and sumbits it for a post request
submit = async (data) => {
  var {publicKey, privateKey} = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );
  publicKey = await crypto.subtle.exportKey("jwk",publicKey);
  privateKey = await crypto.subtle.exportKey("jwk",privateKey);
  var secretKey = data.userid+data.password;
  var salt = Buffer.from([0,0,0,0]);
  var iv = new Int8Array(16);
  for(var i=0;i<16;i++)iv[i]=i%8;
  var enc = new TextEncoder();
  secretKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  var privateKeyStr = Buffer.from(JSON.stringify(privateKey));
  var aes_key = await crypto.subtle.deriveKey({
                "name": "PBKDF2",
                salt: salt,
                "iterations": 100000,
                "hash": "SHA-256"
              },
              secretKey,
              { "name": "AES-CBC", "length": 256},
              true,
              [ "encrypt", "decrypt" ]
            );
  privateKey = await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    aes_key,
    privateKeyStr
  );
  privateKey = Buffer.from(privateKey).toString("base64");
  let res = await axios.post('http://localhost:5000/register',data={
    "name":data.fullname,
    "uid":data.userid,
    "private":privateKey,
    "public":publicKey
  });
  console.log(res);
};

render(){
  return(
    <div align="top">
      <h1>Registration Page</h1>
      <RegistrationForm  submit={this.submit}/>
        <p id="status"></p>
        <Link to="/" className="button">Back to Home</Link>
    </div>
  );
}

}

export default RegistrationPage;
