import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {  chatStore, worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';
import * as helpers from '../../../utils/helpers';
import $ from 'jquery';
import config from '../../../utils/config';
import ChatboxHeader from '../components/chat/ChatboxHeader';
import ChatboxUserList from '../components/chat/ChatboxUserList';
import ChatboxForm from './ChatboxForm';


class Chatbox extends Component {
    constructor(props){
        super(props);
        this.state = {
            text: ""
        };
        this.toggleChatUserList = this.toggleChatUserList.bind(this);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.scrollChat = this.scrollChat.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    };
    onStoreChange(){
        this.forceUpdate();
    };
    onNewMessage() {
        var node = ReactDOM.findDOMNode(this.refs.chatListRef);
    
        // Only scroll if user is within 100 pixels of last message
        var shouldScroll = function() {
          var distanceFromBottom = node.scrollHeight - ($(node).scrollTop() + $(node).innerHeight());
          console.log('DistanceFromBottom:', distanceFromBottom);
          return distanceFromBottom <= 100;
        };
    
        if (shouldScroll()) {
          this.scrollChat();
        }
      }
    scrollChat() {
        var node = ReactDOM.findDOMNode(this.refs.chatListRef);
        $(node).scrollTop(node.scrollHeight);
    }
    componentDidMount(){
        chatStore.on('change', this.onStoreChange);
        chatStore.on('new_message', this.onNewMessage);
        chatStore.on('init', this.scrollChat);
        worldStore.on('change', this.onStoreChange);
    };
    componentWillUnmount(){
        chatStore.off('change', this.onStoreChange);
        chatStore.off('new_message', this.onNewMessage);
        chatStore.off('init', this.scrollChat);
        worldStore.off('change', this.onStoreChange);
    };
    onTextChange(e){
        this.setState({text: e.target.value});
    };
    
    onSend(){
        const self = this;
        Dispatcher.sendAction('SEND_MESSAGE', this.state.text);
        this.setState({text: ''});
    }
    onKeyPress(e) {
        const ENTER = 13;
        if (e.which === ENTER) {
          if (this.state.text.trim().length > 0) {
            this.onSend();
          }
       }
    }
    onFocus() {
        if(worldStore.state.hotkeysEnabled) {
          Dispatcher.sendAction('DISABLE_HOTKEYS', null);
        };
    }
    toggleChatUserList(){
        Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
    }

    render() {
        let chatboxClass = classNames({
            'chatbox' : true,
            'chat_hidden' : !worldStore.state.chatEnabled
        });


        return (
            <section className={chatboxClass}>


                 <ChatboxHeader 
                    showUserList={chatStore.state.showUserList}  
                    toggleChatUserList={this.toggleChatUserList}
                 />
                
                 <ChatboxUserList 
                    userList={chatStore.state.userList}
                    showUserList={chatStore.state.showUserList}
                    user={worldStore.state.user}
                 />

                <div className="chatbox_messages" ref="chatListRef">
                    {
                        chatStore.state.messages.toArray().map((m) => {
                            return (
                              <div key={m.id} className="chatbox_message">
                                <div id="info">
                                <span className="role" id={m.role}> { m.role }</span>
                                <span id="sender"> 
                                    <a href={config.mp_browser_uri + '/' + m.uname }> 
                                     <span id='uname'> { m.user.uname }</span>
                                     </a>   
                                </span>
                                <span id="time"> { helpers.formatDateToTime(m.created_at) } </span>
                                </div>
                              <div id="text" > 
                                  { m.text }
                              </div>
                            </div>
                            );
                        })
                    }
                </div>
                <ChatboxForm
                   onChange={this.onTextChange}
                   onFocus={this.onFocus}
                   onKeyPress={this.onKeyPress}
                   onSend={this.onSend} 
                   text={this.state.text}
                   loadingInitialMessages={chatStore.state.loadingInitialMessages}
                   user={worldStore.state.user ? worldStore.state.user : ''}
                />

            </section>
        );
    }
};

export default Chatbox;