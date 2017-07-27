import React, { Component } from 'react';
import store from '../../stores/configureStore';
import { sendMessage } from '../../actions/chatActions';
import  paperplane   from '../../icons/icon_paperplane.svg';


class ChatboxForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onSend = this.onSend.bind(this);
    }

    onChange(e){
        this.setState({text: e.target.value});
    }
    onSend(){
        store.dispatch(sendMessage());
        this.setState({text: ''});
    }
    onKeyPress(e) {
        let ENTER = 13;
        if (e.which === ENTER ) {
            if (this.state.text.trim().length > 0) {
                this.onSubmit();
            }
        }
    }
    render() {
        return (
            <section className="chatbox_form">
                <input
                 type='text'
                 value={this.state.text}
                 onChange={this.onChange}
                 onKeyPress={this.onKeyPress}
                 onFocus={this.onFocus}
                 ref='input'
                />
                <button type='submit' onSubmit={this.onSend}>        
                    <img src={paperplane} alt="send"/>
                </button>
            </section>
        );
    }
}


export default ChatboxForm;