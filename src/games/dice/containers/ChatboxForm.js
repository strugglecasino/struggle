import React, { Component } from 'react';
import { chatStore, worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';


class ChatboxForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
        this.onStoreChange = this.onStoreChange.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);

    }
    onStoreChange(){
        this.forceUpdate();
    }
    componentDidMount(){
        chatStore.on('change', this.onStoreChange);
        worldStore.on('change', this.onStoreChange);
    }
    componentWillUnmount(){
        chatStore.off('change', this.onStoreChange);
        worldStore.off('change', this.onStoreChange);
    }

    onMessageChange(e){
        let m = e.target.value;
        this.setState({text: m});
    };
    
    onSend(){
        const self = this;
        let { text } = self.state;
        console.log('Send message..');
        Dispatcher.sendAction('SEND_MESSAGE', { text: text});
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
          Dispatcher.sendAction('DISABLE_HOTKEYS');
        };
    }
    render() {
        return (
            <section className="chatbox_form">
                <input
                  type='text'
                  value={this.state.text}
                  onChange={this.onMessageChange}
                  onKeyPress={this.onKeyPress}
                  onFocus={this.onFocus}
                  ref="button"
                  placeholder={worldStore.state.user ? 'Type here...' : 'Login to chat'}
                />
                <button type="submit" onClick={this.onSend}>        
                    <i className="icon-icon_paperplane"></i>
                </button>
            </section>
        );
    }
}

export default ChatboxForm;