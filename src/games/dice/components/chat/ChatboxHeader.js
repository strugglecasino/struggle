import React from 'react';

const ChatboxHeader = ({ showUserList, toggleChatUserList }) => {
    return(
        <section className="chatbox_header">
            <button onClick={toggleChatUserList}>  
              { 
                  showUserList ? 
                   <span> hide users <i className="icon-icon_eye_close"></i> </span> 
                   : 
                   <span> show users <i className="icon-icon_eye"></i> </span> 
              }
            </button>
        </section>
    )
};

export default ChatboxHeader;