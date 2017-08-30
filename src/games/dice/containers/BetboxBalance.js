import React, { Component } from 'react';
import { betStore, worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';

class BetboxBalance extends Component {
    constructor(props){
        super(props);
        let ownFuncs = [
            'onStoreChange', 'onRefreshUser'
        ];

        ownFuncs.forEach((elem) => {
            let DISPLAY_NAME = 'betboxbalance';
            if (!this[elem]) {
                console.error(`self-bind failed '${elem}' to ${DISPLAY_NAME}`);
                return;
            }
            this[elem] = this[elem].bind(this);
        });
    };

    componentDidMount(){
        betStore.on('change', this.onStoreChange);
        worldStore.on('change', this.onStoreChange);
    }
    componentWillUnmount(){
        betStore.off('change', this.onStoreChange);
        worldStore.off('change', this.onStoreChange);
    }

    onStoreChange(){
        this.forceUpdate();
    }

    onRefreshUser(){
        Dispatcher.sendAction('START_REFRESHING_USER');
    };

    render() {
    return (
        <section className="balance">
            <span id="label">
            <i className="icon-icon_btc_line"></i>
            </span>
            <span id="balance"> { worldStore.state.user.balance / 10 }</span>
             <button id="refresh" className="refresh" onClick={this.onRefreshUser}>
                <i className="icon-icon_refresh_line"></i>
            </button>
                { worldStore.state.user.balance.unconfirmed_balance  ? <div className="pending"> { worldStore.state.user.unconfirmed_balance / 10 + ' ' } <span id="comfirmations"> 0/6 confirmations </span></div> : ' ' }
        </section>
    );
   }
}

export default BetboxBalance;