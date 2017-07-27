import React from 'react';
import { formatDateToTime, roleToLabelElement } from '../../utils/helpers';
import store from '../../stores/configureStore';

const chatStore = store.getState().chatStore;

const ChatboxMessages = ({ messages }) => {
    return (
    <ul className="chatbox_messages">

    </ul>
    );
}



export default ChatboxMessages;