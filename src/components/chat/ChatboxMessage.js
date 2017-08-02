import React from 'react';
import * as helpers from '../../utils/helpers';

const ChatboxMessage = ({ m }) => {
    return (
        <li>
            <span id="user"> { helpers.formatDateToTime(m.created_at) } </span>
            <span> { m.uname } </span>
        </li>
    );
}

export default ChatboxMessage;