import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import config from '../../../../utils/config';

const ChatboxUserList = ({userList, showUserList}) => {
    let userListClass = classNames({
        'chatbox_userlist' : true,
        'hide_userlist' : !showUserList
    });

    return(
        <ul className={userListClass}>
            {
                _.values(userList).map((u) => {
                    return (
                        <li key={u.uname}>
                            <a href={config.mp_browser_uri + '/users/' + u.uname }>
                               { u.uname }
                           </a>
                        </li>
                    )
                })
            }
        </ul>
    );
}

export default ChatboxUserList;