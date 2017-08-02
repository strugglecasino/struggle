import React from 'react';
import eye from '../../icons/icon_eye.svg';
import eye_close from '../../icons/icon_eye_close.svg'

const ChatboxHeader = ({ showUserList, toggleChatUserList }) => {
    return(
        <section className="chatbox_header">
            <button onClick={toggleChatUserList}>  
              { showUserList ? <img src={eye_close} alt="hide"/> : <img src={eye} alt="show"/> }
            </button>
        </section>
    )
};

export default ChatboxHeader;