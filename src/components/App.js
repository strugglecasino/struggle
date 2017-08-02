import React, { Component } from 'react';
import { connect } from 'react-redux';
import Topbar from './Topbar';
import Navbar from './Navbar';
import Chatbox from '../containers/Chatbox'
import Betbox from '../containers/Betbox';
import BetTabsNav from '../containers/BetTabsNav';
import BetTabs from '../components/tabs/BetTabs';
import Preloader from '../components/Preloader';
import * as wActions from '../actions/world/';
import * as cActions from '../actions/chat/';
import * as bActions from '../actions/bet/';
import $ from 'jquery';
import * as MoneyPot from '../api/mpApi';
import config from '../utils/config';
import * as helpers from '../utils/helpers';
import socket from 'socket.io-client';


const mapStateToProps = (state) => ({
    world: state.world,
    chat: state.chat
});

const mapDispatchToProps = (dispatch) => ({
    initChat: (data) => dispatch(cActions.initChat(data)),
    initAllBets: (bets) => dispatch(wActions.initAllBets),
    userLogin: (user) => dispatch(wActions.userLogin(user)),
    newAllBet: (bet) => dispatch(wActions.newAllBet(bet)),
    newBet: (bet) => dispatch(wActions.newBet(bet)),
    setNextHash: (nextHash) => (bActions.setNextHash(nextHash)),
    newMessage: (message) => dispatch(cActions.newMessage(message)),
    userJoined: (user) => dispatch(cActions.userJoined(user)),
    userLeft: (user) => dispatch(cActions.userLeft(user)),
    stopLoading: () => dispatch(wActions.stopLoading()),
    userLogout: (user) => dispatch(wActions.userLogout(user)),
    startRefreshingUser: () => dispatch(wActions.startRefreshingUser()),
    stopRefreshingUser: () => dispatch(wActions.stopRefreshingUser()),
    startLoading: () => dispatch(wActions.startLoading())
});


class App extends Component {
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
        let  { world } = this.props;
        return (
            <main>
                {/* $(window.document.ready) ? <Preloader />  : ' ' */}
                <Topbar />
                <Navbar 
                   world={world} 
                    userLogout={this.props.userLogout}
                    openDepositPopUp={this.openDepositPopUp}
                    openWithdrawPopUp={this.openWithdrawPopUp}
                    refreshUser={this.props.startRefreshingUser} 
                />
                <div className="main">
                    <Betbox />
                    <Chatbox />
                </div>
                <div className="tabs">
                    <BetTabsNav />
                    <BetTabs />
                </div>
            </main>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);



var access_token, expires_in, expires_at;

if (helpers.getHashParams().access_token) {
  console.log('[token manager] access_token in hash params');
  access_token = helpers.getHashParams().access_token;
  expires_in = helpers.getHashParams().expires_in;
  expires_at = new Date(Date.now() + (expires_in * 1000));

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('expires_at', expires_at);
} else if (localStorage.access_token) {
  console.log('[token manager] access_token in localStorage');
  expires_at = localStorage.expires_at;
  // Only get access_token from localStorage if it expires
  // in a week or more. access_tokens are valid for two weeks
  if (expires_at && new Date(expires_at) > new Date(Date.now() + (1000 * 60 * 60 * 24 * 7))) {
    access_token = localStorage.access_token;
  } else {
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
  }
} else {
  console.log('[token manager] no access token');
}

// Scrub fragment params from url.
if (window.history && window.history.replaceState) {
  window.history.replaceState({}, document.title, "/");
} else {
  // For browsers that don't support html5 history api, just do it the old
  // fashioned way that leaves a trailing '#' in the url
  window.location.hash = '#';
}
