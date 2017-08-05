/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as Actions from '../actions/chat';
import ChatboxMessages from '../components/chat/ChatboxMessages';
import ChatboxHeader from '../components/chat/ChatboxHeader';
import ChatboxUserList from '../components/chat/ChatboxUserList';
import ChatboxForm from './ChatboxForm';

const mapStateToProps =  state => ({
    chat: state.chat 
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        initChat: (data) => {
             dispatch(Actions.initChat(data));
        },
        userJoined: (user) => {
            dispatch(Actions.userJoined(user));
        },
        userLeft: (user) => {
            dispatch(Actions.userLeft(user));
        },
        sendMessage: (text) => {
            dispatch(Actions.sendMessage(text));
        },
        toggleChatUserList: (showUserList) => {
            dispatch(Actions.toggleChatUserList(showUserList));
        }
    }
}


class Chatbox extends Component {

    onNewMessage(){
        this.scrollChat();
    }
    scrollChat(){

    }
    render() {
        let { chat } = this.props;
        return (
            <section className="chatbox">

                <ChatboxHeader 
                   showUserList={chat.showUserList}  
                   toggleChatUserList={this.props.toggleChatUserList}
                />
                { 
                    chat.showUserList ? 
                      <ChatboxUserList 
                         userList={chat.userList}
                      />
                : ''
                }


                <ChatboxMessages 
                  messages={chat.messages}
                />


                <ChatboxForm />

            </section>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chatbox);