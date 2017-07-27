import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from '../../stores/configureStore';
import $ from 'jquery';
import { sendMessage } from '../../actions/chatActions';
import * as apiActions from '../../api/chatApi';
import ChatboxMessages from './ChatboxMessages';
import ChatboxHeader from './ChatboxHeader';
import ChatboxForm from './ChatboxForm';



const mapStateToProps = (state)  => ({
    chatStore: store.getState().chatStore
});



class Chatbox extends Component {
    constructor(props) {
        super(props);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.onSend = this.onSend.bind(this);
        this.scrollChat = this.scrollChat.bind(this);
    }
    componentDidMount(){
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    onNewMessage(){
        let node = this.refs.chatListRef.getDOMNode();

        let shouldScroll = function(){
            let distanceFromBottom = node.scrollHeight - ($(node).scrollTop() + $(node).innerHeight());
            console.log('DistanceFromBottom:', distanceFromBottom );
            return distanceFromBottom <= 100;
        };
        if (shouldScroll()) {
            this.scrollChat();
        }
    };
    scrollChat() {
        let node = this.refs.chatListRef.getDOMNode();
        $(node).scrollTop(node.scrollHeight);
    }
    onSend(){
        store.dispatch(sendMessage());
    }
    render() {

        return (
            <section className="chatbox">
                <ChatboxHeader />
                <ChatboxMessages  />
                <ChatboxForm onSend={this.onSend} />
            </section>
        );
    }
}

export default connect(mapStateToProps)(Chatbox);