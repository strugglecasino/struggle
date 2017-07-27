import React from 'react';
import config from '../utils/config';
import DropDown from './DropDown';
import BetboxBalance from './bet/BetboxBalance';
import Logo from '../struggle.svg';

// eslint-disable //

const Navbar = ({user}) => {
    return (
        <section className="navbar">
            <div className="navbar_side">
                { user ? <BetboxBalance /> : '' }
            </div>
            <div className="navbar_center">
                <a href="/">
                     <img src={Logo} alt="struggle"/>
                </a>
            </div>
            <div className="navbar_side">
                 { user ? <DropDown /> : <div> <a href={config.mp_browser_uri + '/login/?app_id=' + config.app_id }> LOGIN </a> or <a href={config.mp_browser_uri + '/register/'}> REGISTER </a></div> }
            </div>
        </section>
    );
}

export default Navbar;