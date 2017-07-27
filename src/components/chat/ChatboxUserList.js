import React from 'react';
import _ from 'lodash';
import { roleToLabelElement } from '../../utils/helpers';

const ChatboxUserList = ({userList}) => {
    return (
        <ul className="chatbox_userList">
            {
                _.values(userList).map((u) => {
                    return (
                        <li key={u.uname}>
                            { roleToLabelElement(u.role) + ' ' + u.uname }
                        </li>
                    )
                })
            }
        </ul>
    );
}

export default ChatboxUserList;