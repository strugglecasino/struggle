import React, { Component } from 'react';
import propTypes from 'prop-types';
import store from '../../stores/configureStore';
import { changeTab } from '../../actions/worldActions';

/* eslint-disable */



class BetTabsNav extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, store.getState().worldStore);
        console.log(this.state);
        this.makeChangeTabHandler = this.makeChangeTabHandler.bind(this);
    };

    makeChangeTabHandler(tabName) {
        this.state.currTab = tabName;
        return function(){
            store.dispatch(changeTab());
        }
    }
    render() {
        return (
            <ul className="bet_tabs_nav">
                <li>
                    <a 
                      className={ this.state.currTab === 'ALL_BETS' ? 'active' : '' } 
                      onClick={this.makeChangeTabHandler('ALL_BETS')} 
                      href="javascript:void()"> ALL BETS 
                    </a>
                </li>
                <li>
                    <a className={ this.state.currTab === 'MY_BETS' ? 'active' : '' } 
                    onClick={this.makeChangeTabHandler('MY_BETS')}  
                    href="javascript:void()"> MY BETS </a>
                </li>
                <li>
                    <a href="javascript:void()"> HIGH ROLLS </a>
                </li>
            </ul>
        );
    }
}

propTypes.default = {
    tabName: propTypes.string.isRequired
}

export default BetTabsNav;