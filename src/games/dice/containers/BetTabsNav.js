import React, { Component } from 'react';
import { worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';

/* eslint-disable no-script-url */

class BetTabsNav extends Component {
    constructor(props){
        super(props);
        this.makeTabChangeHandler = this.makeTabChangeHandler.bind(this);
        this.onStoreChange = this.onStoreChange.bind(this);
    }
    onStoreChange(){
        this.forceUpdate();
    }
    componentDidMount(){
        worldStore.on('change', this.onStoreChange);
    }
    componentWillUnmount(){
        worldStore.off('change', this.onStoreChange);
    }
    makeTabChangeHandler(tabName){
        return  (e) => {
            e.preventDefault();
            Dispatcher.sendAction('CHANGE_TAB', tabName);
        }
    }
    render(){
        return (
            <ul className="bet_tabs_nav">
                <li className={ worldStore.state.currTab === 'ALL_BETS' ? 'active' : '' }>
                    <a 

                      href='javascript:void()'
                      onClick={this.makeTabChangeHandler('ALL_BETS')}
                    >
                       ALL BETS  
                    </a>
                </li>
                <li  className={ worldStore.state.currTab === 'MY_BETS' ? 'active' : '' }> 
                    <a 
                       href="javascript:void()"
                       onClick={this.makeTabChangeHandler('MY_BETS')}
                    > 
                    
                    MY BETS 
                       
                    </a>
                </li>
                <li 
                   className={ worldStore.state.currTab === 'HIGH_ROLLS' ? 'active' : '' }>
                    <a 
                      href="javascript:void()"
                      onClick={this.makeTabChangeHandler('HIGH_ROLLS')}
                    > 
                      HIGH ROLLS 
                      </a>
                </li>
            </ul>
        );
    }
}


export default BetTabsNav;