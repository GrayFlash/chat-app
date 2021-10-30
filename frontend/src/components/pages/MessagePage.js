import React from 'react';
import ChatForm from '../forms/ChatForm';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationList, Conversation, ConversationHeader } from '@chatscope/chat-ui-kit-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
// const IPFS = require('ipfs')

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient.create('https://ipfs.infura.io:5001/api/v0');
class MessagePage extends React.Component{

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor (props) {
    super(props);
    const { cookies } = props;
    setInterval(this.syncmsg,5000);
    this.getUserlist();
  }

  state = {
    data: [],
    users : [],
    loading: false,
    errors: {},
    currData : {
      senderid: '',
      receiverid: '',
      cid: '',
      message: '',
    }
  };

  onChange = e => this.setState({currData: {...this.state.currData, message: e.target.value}});

  submit = async(data) => {
    const {cookies} = this.props;
    data.senderid = cookies.get('userid');
    var passtoken = cookies.get('passtoken');
    if(data.receiverid == '')data.receiverid=data.senderid;
    var res = await axios.get('http://localhost:5000/getpublickey?uid='+data.receiverid);
    var publicKey = Buffer.from(res.data,'base64');
    publicKey = JSON.parse(Buffer.from(publicKey).toString());
    publicKey = await crypto.subtle.importKey("jwk",publicKey,{
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt"]);
    var msg = Buffer.from(data.message);
    var genAES = await crypto.subtle.generateKey(
      {
        name: "AES-CBC",
        length: 256
      }
      ,true,["encrypt","decrypt"]
    );
    var salt = Buffer.from([0,0,0,0]);
    var iv = new Int8Array(16);
    for(var i=0;i<16;i++)iv[i]=i%8;
    var enc = new TextEncoder();
    msg = await crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },genAES,msg
    );
    genAES = await crypto.subtle.exportKey("jwk",genAES);
    genAES = Buffer.from(JSON.stringify(genAES));
    var encrypted_key = await crypto.subtle.encrypt({
      name:"RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"},publicKey,genAES);
      msg = {data:[Buffer.from(encrypted_key).toString('base64'),Buffer.from(msg).toString('base64')]};
    msg = JSON.stringify(msg);
    const file = {path:data.senderid+data.receiverid, content: msg};
    const filesAdded = await ipfs.add(file);
    data.cid =  filesAdded.cid._baseCache.get('z');
    console.log(data.cid);
    var res = await axios.post('http://localhost:5000/message',data={
      uid:data.senderid,
      receiver:data.receiverid,
      cid:data.cid,
      token:passtoken
    });
    console.log(res);
};

  syncmsg = async () => {
    const {cookies} = this.props;
    var senderid = cookies.get('userid');
    var passtoken = cookies.get('passtoken');
    var privateKey = cookies.get('privatekey');
    privateKey = await crypto.subtle.importKey("jwk",privateKey,{
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["decrypt"]);
    var res = await axios.post('http://localhost:5000/chatsync',{
      uid:senderid,
      token:passtoken
    });
    var msgs = [];
    for(var i=0;i<res.data.length;i++){
      var message = await axios.get('https://gateway.ipfs.io/ipfs/'+res.data[i].content_id); 
      var key = await crypto.subtle.decrypt({
        name:"RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"},privateKey,Buffer.from(message.data.data[0],'base64'));
      key = JSON.parse(Buffer.from(key).toString());
      var salt = Buffer.from([0,0,0,0]);
      var iv = new Int8Array(16);
      for(var ij=0;ij<16;ij++)iv[ij]=ij%8;
      var enc = new TextEncoder();
      key = await crypto.subtle.importKey(
        "jwk",key,{
          name: "AES-CBC",
          iv: iv,
        },true,["encrypt","decrypt"]
      );
      var msg = await crypto.subtle.decrypt({
        name: "AES-CBC",
        iv: iv,
      },key,Buffer.from(message.data.data[1],'base64'));
      msg = Buffer.from(msg).toString();
      msgs[i] = {
        message:msg,
        sender:res.data[i].sender,
        receiver:res.data[i].reciever
      };
    }
    console.log(msgs);
  };

  getUserlist = async () => {
    let userlist = await axios.get('http://localhost:5000/userlist');
    this.setState(this.state = {users:userlist.data});
    //console.log(userlist);
    this.forceUpdate();
  };

  render(){
    const {data, currData} = this.state;
    const {cookies} = this.props;
    var uid = cookies.get('userid');
    return(
      <div id="chat1234">
        <div style={{ position: "relative", height: "500px" }}>
          <MainContainer>
            <ConversationList>
              {this.state.users.map((usr)=> <Conversation name={usr.username} >
                  <Conversation.Operations onClick={() => this.setState({receiverid:usr})} />
                  </Conversation>
              )}
            </ConversationList>

            <ChatContainer >
              <ConversationHeader>
              <ConversationHeader.Content userName={uid} />
              </ConversationHeader>
              <MessageList>
                {data.map((msg) => <Message model={{message: msg, sentTime: "just now",sender: "Joe"}}/>)}
              </MessageList>
              <ChatForm as="MessageInput" submit={this.submit}/>
            </ChatContainer>

          </MainContainer>
        </div>
      </div>
    );
  }
}

export default withCookies(MessagePage);
