import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../actions/chat/';
import  paperplane   from '../icons/icon_paperplane.svg';

const mapStateToProps = state => ({
    chat: state.chat,
    world: state.world
});

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (text) => dispatch(sendMessage(text))
});


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
        this.props.sendMessage({text: this.state.text});
        this.setState({text: ''});
    }
    onKeyPress(e) {
        let ENTER = 13;
        if (e.which === ENTER ) {
            if (this.state.text.trim().length > 0) {
                this.onSend();
            }
        }
    }
    onfocus() {
        if(this.props.chat.hotkeysEnabled) {
            this.props.world.hotkeysEnabled = !this.props.world.hotkeysEnabled;
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
                <button type='submit' onClick={this.onSend}>        
                    <img src={paperplane} alt="send"/>
                </button>
            </section>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChatboxForm);