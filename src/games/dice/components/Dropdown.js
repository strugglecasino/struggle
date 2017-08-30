import React, { Component } from 'react';

/* eslint-disable */


class Dropdown extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false
        };
        let ownFuncs = [
            'dropDownToggle'
        ];
        ownFuncs.forEach((elem) => {
            let DISPLAY_NAME = 'betbox';
            if (!this[elem]) {
                console.error(`self-bind failed \'${elem}' to ${DISPLAY_NAME}`);
                return;
            }
            this[elem] = this[elem].bind(this);
        });
    }
    dropDownToggle(){
        if(this.state.isOpen) {
            this.setState({isOpen: false});
        } else {
            this.setState({isOpen: true});
        }
    }
    render(){
        let { user, userLogout, openWithdrawPopUp, openDepositPopUp } = this.props;
        let dropDownMenuClass = 'menu';
        if(this.state.isOpen) {
            dropDownMenuClass += ' open';
        }
        return (
            <section className='dropdown'>
                <button className="dropdown_toggle" onClick={this.dropDownToggle}>
                    { user.uname + ' ' }  <i className="icon-icon_chevron"></i>
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