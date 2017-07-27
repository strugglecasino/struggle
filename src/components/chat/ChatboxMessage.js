import React from 'react';
import { formatDateToTime, roleToLabelElement } from '../../utils/helpers';

const ChatboxMessage = ({ m }) => {
    return (
        <li key={m.id}>
            <span>{ formatDateToTime(m.created_at) }</span>
            <span> { roleToLabelElement(m.user.role) }</span>
            <span> { m.text } </span>
        </li>
    );
}

export default ChatboxMessage;