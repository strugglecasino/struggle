import React from 'react';

const ChatboxMessage = ({ m, config, helpers }) => {
    return (
    <li key={m.id} className="chatbox_message" >
        <span id="message_time"> { helpers.formatDateToTime(m.created_at) } </span>
        <span id="message_user"> 
         <a href={config.mp_browser_uri + '/' + m.uname }> 
              {m.user ?  helpers.roleToLabelElement(m.user.role) : ' ' } 
              { m.user ?  ' ' : ' ' } 
              <span> { m.user ? m.user.uname : 'SYSTEM :: '  + <span> { m.text } </span> } </span>
         </a>   
      </span>
                { m.user ? <span id="message_content" > { m.text } </span> : '' }
    </li>
    );
};

export default ChatboxMessage;