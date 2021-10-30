import React from 'react';
import {Link} from "react-router-dom";
import LoginForm from "../forms/LoginForm";
import axios from 'axios';
import {Button } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';


class LoginPage extends React.Component{

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor (props) {
    super(props);
    const { cookies } = props;
  }

//This gets the data and sends it as a post request
submit = async (data) => {
  var serverdata = await axios.get('http://localhost:5000/loginReq?uid='+data.userid);
  serverdata = serverdata.data;
  var secretKey = data.userid + data.password;
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
  var privateKey = Buffer.from(serverdata[0].privatekey,'base64');
  privateKey = Buffer.from(privateKey.toString('utf-8'),'base64');
  privateKey = await crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    aes_key,
    privateKey
  );
  privateKey = JSON.parse(Buffer.from(privateKey).toString());
  privateKey = await crypto.subtle.importKey("jwk",privateKey,{
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256"
  },
  true,
  ["decrypt"]);
  var publicKey = Buffer.from(serverdata[0].publickey,'base64');
  publicKey = JSON.parse(Buffer.from(publicKey).toString());
  publicKey = await crypto.subtle.importKey("jwk",publicKey,{
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256"
  },
  true,
  ["encrypt"]);
  var decrypted_token = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },privateKey,Buffer.from(serverdata[1],'base64')
  );
  let res = await axios.post('http://localhost:5000/loginRes',data={
    "uid":data.userid,
    "token":Buffer.from(decrypted_token).toString('base64')
  });
  if(res.statusText == "OK"){
  const {cookies} = this.props;
  cookies.set('passtoken',decrypted_token);
  cookies.set('privatekey',privateKey);
  cookies.set('publicKey',publicKey);
  }
};

render(){
  return(
      <div>
          <h1>Login Page</h1>
          <LoginForm submit={this.submit}/>
          <p id="status"></p>
          <p>Make a new account? Right here.</p>
          <Link to="/registration" className="button">Registration</Link>
      </div>

    );
  }
}




export default withCookies(LoginPage);
