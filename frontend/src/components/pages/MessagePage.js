import React from 'react';
import ChatForm from '../forms/ChatForm';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationList, Conversation, ConversationHeader } from '@chatscope/chat-ui-kit-react';

// const IPFS = require('ipfs')

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient.create('https://ipfs.infura.io:5001/api/v0');
class MessagePage extends React.Component{

  state = {
    data: {
      senderid: '',
      receiverid: '',
      message: '',
      cid: '',
    },
    loading: false,
    errors: {}
  };

  onChange = e => this.setState({data: {...this.state.data, [e.target.name]: e.target.value}});

  submit = async(data) => {
    console.log("data - message",data.message)

    const file = {path:data.senderid+data.receiverid, content: Buffer.from(data.message)};
    const filesAdded = await ipfs.add(file);
    data.cid =  filesAdded.cid._baseCache.get('z')
    
    console.log(data.cid, data.senderid, data.receiverid, data.message);

  };

  render(){
    const {data} = this.state;

    return(
      <div>
        <div style={{ position: "relative", height: "500px" }}>
          <MainContainer>
            <ConversationList>
              {this.state.users.map((usr)=> <Conversation lastSenderName="You" name="Lilly" info="Yes, i can do it for you">
          <Conversation.Operations onClick={() => alert('Operations clicked')} />
        </Conversation>)}
            </ConversationList>
            <ChatContainer >
              <ConversationHeader>
              <ConversationHeader.Content userName="Jane Doe" />
              </ConversationHeader>
              <MessageList>
                {data.map((msg) => <Message model={{message: msg, sentTime: "just now",sender: "Joe"}}/>)}
              </MessageList>
              <MessageInput placeholder="Type message here" />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    );
  }
}

export default MessagePage;
