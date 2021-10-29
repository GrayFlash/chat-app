import React from 'react';
import propTypes from 'prop-types';
import {Button } from 'semantic-ui-react';
import Toggle from 'react-toggle';
import "react-toggle/style.css"


 class RegistrationForm extends React.Component {
   state = {
     data: {
       fullname:'',
       userid: '',
       password: '',
     },
     loading: false,
     errors: {}
   };

   onChange = e => this.setState({data: {...this.state.data, [e.target.name]: e.target.value}});

   onSubmit = (e) => {
      e.preventDefault();
      this.props.submit(this.state.data);
   };

   render() {
     const {data} = this.state;

     return(

      <div>
      <form onSubmit = {this.onSubmit} >

          <label htmlFor="fullname"><b>Full name</b></label><br/>
          <input type="fullname" placeholder="Enter Full name" id="username" name="fullname" value={data.fullname} onChange = {this.onChange} required/>

          <br/><br/>

          <label htmlFor="userid"><b>userid</b></label><br/>
          <input type="userid" placeholder="Enter userid" id="userid" name="userid" value={data.userid} onChange = {this.onChange} required/>

          <br/><br/>

          <label htmlFor="password"><b>Password</b></label><br/>
          <input type="password" placeholder="Enter Password" id="password" name="password" value={data.password} onChange = {this.onChange} required/>
          <br/><br/>
          <button type="submit" className="button">Register</button>
      </form>
    </div>

     );
    }
}

 RegistrationForm.propTypes = {
   submit: propTypes.func.isRequired
 };

 export default RegistrationForm;
