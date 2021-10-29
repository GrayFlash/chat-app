import React from 'react';
import propTypes from 'prop-types';
import {Button} from 'semantic-ui-react';

 class LoginForm extends React.Component {
   state = {
     data: {
       userid: '',
       password: ''
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


        <form onSubmit = {this.onSubmit} >
            <label htmlFor="userid"><b>Userid</b></label><br/>
            <input type="userid" placeholder="Enter userid" id="userid" name="userid" value={data.userid} onChange = {this.onChange} required/>

            <br/><br/>

            <label htmlFor="password"><b>Password</b></label><br/>
            <input type="password" placeholder="Enter Password" id="password" name="password" value={data.password} onChange = {this.onChange} required/>


            <br/><br/>
            <Button type="submit" primary>Login</Button>
        </form>


     );
    }
}

 LoginForm.propTypes = {
   submit: propTypes.func.isRequired
 };

 export default LoginForm;
