import React from 'react';

const ChatboxHeader = ({ showUserList, toggleChatUserList }) => {
    let textOptions;
    if(showUserList) {
        textOptions = 'HIDE USERS';
    } else {
        textOptions = 'SHOW USERS'
    };
    return(
        <section className="chatbox_header" >
            <button onClick={toggleChatUserList}>  
              <span> { textOptions } </span>
              { 
                  showUserList ? 
                   <i className="icon-icon_eye_cross_line"> </i> 
                   : 
                  <i className="icon-icon_eye_line"></i>
              }
            </button>
        </section>
    )
};

export default ChatboxHeader;