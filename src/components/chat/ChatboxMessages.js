import React, { Component } from 'react';
import * as helpers from '../../utils/helpers';
import config from '../../utils/config';

class ChatboxMessages extends Component {
    render () {
        let { messages } = this.props;
        return (
        <ul className="chatbox_messages">
            {
                messages.toArray().map((m) => {
                    return (
                        <li key={m} className="chatbox_message" ref="chatListRef">
                            <span id="message_time"> { helpers.formatDateToTime(m.created_at) } </span>
                            <span id="message_user"> 
                                <a href={config.mp_browser_uri + '/' + m.uname }> 
                                { helpers.roleToLabelElement(m.user.role)  + ' ' + m.uname } 
                                </a> 
                            </span>
                                <span id="message_content" > { m.text } </span>
                        </li>
                        )
                 })
            }
       </ul>
    );
  }
}

export default ChatboxMessages;