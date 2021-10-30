import React from 'react';
import propTypes from 'prop-types';
import {Button } from 'semantic-ui-react';

class ChatForm extends React.Component{

  state = {
    data: {
      senderid: '',
      receiverid: '',
      message: '',
    },
    loading: false,
    errors: {}
  };

  onChange = e => this.setState({data: {...this.state.data, [e.target.name]: e.target.value}});

  onSubmit = (e) => {
    e.preventDefault();
    this.props.submit(this.state.data);
  };


render(){
  const {data} = this.state;

  return(
        <form onSubmit={this.onSubmit}>
            
            {/* <label htmlFor="senderid"><b>Sender ID</b></label><br/>
            <input type="senderid" placeholder="Enter Your ID" id="senderid" name="senderid" value={data.senderid} onChange = {this.onChange} required/>
            
            <br/><br/>

            <label htmlFor="receiverid"><b>Receiver ID</b></label><br/>
            <input type="receiverid" placeholder="Enter Receipient ID" id="receiverid" name="receiverid" value={data.receiverid} onChange = {this.onChange} required/>
            
            <br/><br/> */}

            {/* <label htmlFor="message"><b>Message</b></label><br/> */}
            <input type="message" placeholder="Enter Message" id="message" name="message" value={data.message} onChange = {this.onChange} required/>
            
            {/* <br/><br/> */}

            <Button type="submit" primary>Send</Button>
        </form>

    );
  }
}

ChatForm.propTypes = {
    submit: propTypes.func.isRequired
};

export default ChatForm;
