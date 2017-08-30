import React, { Component } from 'react';
import Loader from '../components/Loader';

class ChatboxForm extends Component {
    render() {
        return (
            <section className="chatbox_form">
                { this.props.loadInitialMessages ? <Loader /> :
                <input
                  type='text'
                  value={this.props.text}
                  onChange={this.props.onChange}
                  onKeyPress={this.props.onKeyPress}
                  onFocus={this.props.onFocus}
                  ref='input'
                  placeholder={this.props.user ? 'Type here...' : 'Login to chat'}
                />
                }
                <button 
                   type="button" 
                   disabled={!this.props.user 
                   || this.props.waitingForServer 
                   || this.props.text.trim().length === 0}
                   onClick={this.props.onSend}>        
                    <i className="icon-icon_paperplane_line"></i>
                </button>
            </section>
        );
    }
}

export default ChatboxForm;