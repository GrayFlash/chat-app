import React from 'react';
import ChatForm from '../forms/ChatForm';
// const IPFS = require('ipfs')

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient.create('https://ipfs.infura.io:5001/api/v0');

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

    const file = {path:data.senderid+data.receiverid, content: Buffer.from(data.message)};
    const filesAdded = await ipfs.add(file);
    console.log(filesAdded);

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
