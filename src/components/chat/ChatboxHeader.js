import React from 'react';
import ChatboxUserList from './ChatboxUserList';
import eye from '../../icons/icon_eye.svg';
import eye_close from '../../icons/icon_eye_close.svg'

const ChatboxHeader = ({userList, showUserList, toggleChatUserList}) => {
    return (
        <section className="chatbox_header">
            <button onClick={toggleChatUserList}> 
              { showUserList ? <img src={eye} alt="eye"/> : <img src={eye_close} alt="eye_close"/> }
            </button>
            { showUserList ? <ChatboxUserList userList={userList}/> : '' }
        </section>
    );
}

export default ChatboxHeader;