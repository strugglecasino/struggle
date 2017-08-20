import React, { Component } from 'react';
import {  chatStore, worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';
import * as helpers from '../../../utils/helpers';
import config from '../../../utils/config';
//import $ from 'jquery';
import ChatboxMessage from '../components/chat/ChatboxMessage';
import ChatboxHeader from '../components/chat/ChatboxHeader';
import ChatboxUserList from '../components/chat/ChatboxUserList';
import ChatboxForm from './ChatboxForm';


class Chatbox extends Component {

    constructor(props){
        super(props);
        this.toggleChatUserList = this.toggleChatUserList.bind(this);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.scrollChat = this.scrollChat.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
    };
    onStoreChange(){
        this.forceUpdate();
    }

    onNewMessage(){
        const node = this.refs.chatListRef;
        const shouldScroll = function(){
        const distanceFromBottom = node.scrollHeight - node.scrollTop() + node.innerHeight();
        console.log('DistanceFromBottom:', distanceFromBottom);
        return distanceFromBottom <= 50;
        };
        if(shouldScroll()){
            this.scrollChat();
        }
        Dispatcher.sendAction('NEW_MESSAGE');

    }

    scrollChat(){
        const node = this.refs.chatListRef;
        node.scrollTop(node.scrollHeight);
        Dispatcher.sendAction('INIT_CHAT');
    }

    componentDidMount(){
        chatStore.on('change', this.onStoreChange);
        chatStore.on('new_message', this.onNewMessage);
        chatStore.on('init', this.scrollChat);
        worldStore.on('change', this.onStoreChange);
    }
    componentWillUnmount(){
        chatStore.off('change', this.onStoreChange);
        chatStore.off('new_message', this.onNewMessage);
        chatStore.off('init', this.scrollChat);
        worldStore.off('change', this.onStoreChange);
    }

    toggleChatUserList(){

        Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
    }

    render() {
        let chatboxClass = 'chatbox';
        if(!worldStore.state.chatEnabled) {
            chatboxClass = 'chat_hidden';
        }
        return (
            <section className={chatboxClass}>

                 <ChatboxHeader 
                    showUserList={chatStore.state.showUserList}  
                    toggleChatUserList={this.toggleChatUserList}
                 />
                { 
                    chatStore.state.showUserList ? 
                      <ChatboxUserList 
                         userList={chatStore.state.userList}
                      />
                : ''
                }

                <ul className="chatbox_messages" ref="chatListRef">
                    {
                        chatStore.state.messages.toArray().map(function(m) {
                            return (
                                <ChatboxMessage 
                                  m={m}
                                  helpers={helpers}
                                  config={config}
                                />
                            );
                        })
                    }
                </ul>


                <ChatboxForm />

            </section>
        );
    }
}

export default Chatbox;