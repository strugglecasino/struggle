import React from 'react';
import _ from 'lodash';
import * as helpers from '../../utils/helpers';
import config from '../../utils/config';

const ChatboxUserList = ({userList}) => {

    return (
        <ul className='chatbox_userlist'>
            {
                _.values(userList).map((u) => {
                    return (
                        <li key={u.uname}>
                           <a href={config.mp_browser_uri + '/' + u.uname }> 
                           { helpers.roleToLabelElement(u.role) + ' ' + u.uname } 
                          </a>
                        </li>
                    )
                })
            }
        </ul>
    );
}

export default ChatboxUserList;