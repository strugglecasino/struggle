import React, { Component } from 'react';
import chevron from '../icons/icon_chevron.svg';

/* eslint-disable */

class Dropdown extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false
        }
        this.dropDownToggle = this.dropDownToggle.bind(this);
    }
    dropDownToggle(){
        if(this.state.isOpen) {
            this.setState({isOpen: false});
        } else {
            this.setState({isOpen: true});
        }
    }
    render(){
        let { world, userLogout, openWithdrawPopUp, openDepositPopUp } = this.props;
        let dropDownMenuClass = 'menu';
        if(this.state.isOpen) {
            dropDownMenuClass += ' open';
        }
        return (
            <section className='dropdown'>
                <button className="dropdown_toggle" onClick={this.dropDownToggle}>
                    { world.user.uname + ' ' }  <img src={chevron} alt="chevron"/>
                </button>
                <ul className={dropDownMenuClass}>
                    <li>
                        <button onClick={openDepositPopUp}> 
                            DEPOSIT
                        </button>
                    </li>
                    <li>
                        <button onClick={openWithdrawPopUp}>
                            CASHOUT
                        </button>
                    </li>
                    <li>
                        <button onClick={userLogout}> 
                            LOGOUT 
                        </button>
                    </li>
                </ul>
            </section>
        );
    }
}

export default Dropdown;