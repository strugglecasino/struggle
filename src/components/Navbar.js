import React from 'react';
import config from '../utils/config';
import Dropdown from './Dropdown';
import BetboxBalance from './bet/BetboxBalance';
import Logo from '../struggle.svg';

// eslint-disable //

const Navbar = ({world, userLogout, openDepositPopUp, openWithdrawPopUp, refreshUser, onRefreshClick }) => {
        return (
        <section className="navbar">
            <button className="toggle_button">
                ☰
            </button>
            <div className="navbar_side">
                { world.user ? <BetboxBalance 
                                  balance={world.user.balance}
                                  onClick={onRefreshClick}
                                  refreshUser={refreshUser} 
                                  unconfirmed_balance={world.user.unconfirmed_balance}
                               /> 
                  : 
                  '' 
                }
            </div>
            <div className="navbar_center">
                <a href="/">
                     <img src={Logo} alt="struggle"/>
                </a>
            </div>
            <div className="navbar_side">
                 { 
                     world.user ? <Dropdown 
                                      openWithdrawPopUp={openWithdrawPopUp}
                                      openDepositPopUp={openDepositPopUp}
                                      userLogout={userLogout} 
                                      world={world} 
                                   /> 
                    : 
                     <div> 
                         <a href={config.mp_browser_uri + '/login/?app_id=' + config.app_id }> 
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