import React from 'react';
import ChatForm from '../forms/ChatForm';

class MessagePage extends React.Component{

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

  submit = async(data) => {
    console.log("data - message",data.message)
  };

  render(){
    const {data} = this.state;

    return(
      <div>
        <h1>Chat Browser</h1>
        <ChatForm submit={this.submit}/>

      </div>
    );
  }
}




export default MessagePage;
