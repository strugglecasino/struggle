import React, { Component } from 'react';
import { connect } from 'react-redux';
import Topbar from './Topbar';
import Navbar from './Navbar';
import Chatbox from '../containers/Chatbox';
import Betbox from '../containers/Betbox';
import BetTabsNav from '../containers/BetTabsNav';
import BetTabs from '../components/tabs/BetTabs';
// import Preloader from '../components/Preloader';
import * as worldActions from '../actions/world/';
// import * as chatActions from '../actions/chat/';
// import * as betActions from '../actions/bet/';
import $ from 'jquery';
// import * as MoneyPot from '../api/mpApi';
import config from '../utils/config';
// import * as helpers from '../utils/helpers';
// import socket from 'socket.io-client';


const mapStateToProps = (state) => ({
    world: state.world,
    chat: state.chat
});

const mapDispatchToProps = (dispatch) => {
    return {
        userLogout: (user) => dispatch(worldActions.userLogout()),
        changeTab: (tabName) => dispatch(worldActions.changeTab())
    }
};


class App extends Component {
    onRefreshClick(){
            $('#refresh').click(function(){
                $('.refresh').toggleClass('.resfresh_active');
            })
    };


    openDepositPopUp(){
        let windowUrl = config.mp_browser_uri + '/dialog/deposit?app_id=' + config.app_id;
        let windowName = 'manage-auth';
        let windowOpts = [
            'width=420',
            'height=350',
            'left=100',
            'top=100'
        ].join(',');
        let windowRef = window.open(windowUrl, windowName, windowOpts);
        windowRef.focus();
        return false;
    };
    openWithdrawPopUp(){
        let windowUrl = config.mp_browser_uri + '/dialog/withdraw?app_id=' + config.app_id;
        let windowName = 'manage-auth';
        let windowOpts = [
            'width=420',
            'height=350',
            'left=100',
            'top=100'
        ].join(',');
        var windowRef = window.open(windowUrl, windowName, windowOpts);
        windowRef.focus();
        return false;   
    };

    render () {
        let  { world, chat, userLogout } = this.props;
        return (
            <main>

                <Topbar 
                  userList={chat.userList}/>
                <Navbar 
                    world={world} 
                    onRefreshClick={this.onRefreshClick}
                    userLogout={userLogout}
                    openDepositPopUp={this.openDepositPopUp}
                    openWithdrawPopUp={this.openWithdrawPopUp}
                />
                <div className="main">
                    <Betbox />
                    <Chatbox />
                </div>
                <div className="tabs">
                    <BetTabsNav 
                      currTab={world.currTab}
                    />
                    <BetTabs />
                </div>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);