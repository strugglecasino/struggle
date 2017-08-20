import React from 'react';
import config from '../../../utils/config';
import Dropdown from './Dropdown';
import BetboxBalance from '../containers/BetboxBalance';
import Logo from '../../../struggle.svg';

/* eslint-disable */

const Navbar = ({ user, chatEnabled,userLogin, userLogout, openDepositPopUp, openWithdrawPopUp, toggleChat }) => {
        return (
        <section className="navbar">
            <button className="toggle_button">
                ☰
            </button>
            <div className="navbar_side">
                { user ? <BetboxBalance  />  : '' }
            </div>
            <div className="navbar_center">
                <a href="/">
                     <img src={Logo} alt="struggle"/>
                </a>
            </div>
            <div className="navbar_side">
                 
                 { 
                     user ? 


                            <div id="user_info">


                            <button id="toggle_chat" onClick={toggleChat}>
                               { chatEnabled ? <i className="icon-icon_chat_close"></i> : <i className="icon-icon_chat"></i>}
                            </button>
                     
                            <Dropdown 
                              openWithdrawPopUp={openWithdrawPopUp}
                              openDepositPopUp={openDepositPopUp}
                              userLogout={userLogout} 
                              user={user}
                            /> 
                        </div>
                    : 
                     <div> 
                         <a  
                             onClick={userLogin}
                             href={config.mp_browser_uri + 
                             '/oauth/authorize' + '?app_id=' + config.app_id
                              + '&redirect_uri=' + config.redirect_uri}> 
                             LOGIN 
                         </a> 
                         or 
                         <a href={config.mp_browser_uri + '/register/'}>   REGISTER 
                         </a>
                     </div> 
                 }
            </div>
        </section>
    );

}

export default Navbar;