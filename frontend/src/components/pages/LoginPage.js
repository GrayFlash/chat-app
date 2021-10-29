import React from 'react';
import {Link} from "react-router-dom";
import LoginForm from "../forms/LoginForm";
import axios from 'axios';
import {Button } from 'semantic-ui-react';


class LoginPage extends React.Component{

//This gets the data and sends it as a post request
submit = data => {
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




export default LoginPage;
