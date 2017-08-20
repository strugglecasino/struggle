import React, { Component } from 'react';
import { betStore, worldStore, chatStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';
import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import Chatbox from './Chatbox';
import Betbox from './Betbox';
import BetTabsNav from './BetTabsNav';
import BetTabs from '../components/tabs/BetTabs';
// import Preloader from '../components/Preloader';
import $ from 'jquery';
import config from '../../../utils/config';
import MoneyPot from '../../../api/mpApi';
import socket from 'socket.io-client';

class App extends Component {

    constructor(props){
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.onRefreshClick = this.onRefreshClick.bind(this);
        this.openDepositPopUp = this.openDepositPopUp.bind(this);
        this.openWithdrawPopUp = this.openWithdrawPopUp.bind(this);
        this.toggleChat = this.toggleChat.bind(this);
        this.userLogin = this.userLogin.bind(this);
        this.userLogout = this.userLogout.bind(this);
    };

    componentDidMount(){
        betStore.on('change', this.onStoreChange);
        worldStore.on('change', this.onStoreChange);
        chatStore.on('change', this.onStoreChange);
    }
    componentWillUnmount(){
        betStore.off('change', this.onStoreChange);
        worldStore.off('change', this.onStoreChange);
        chatStore.off('change', this.onStoreChange);
    }

    onStoreChange(){
        this.forceUpdate();
    }

    toggleChat(){
      Dispatcher.sendAction('TOGGLE_CHAT');
    }

    onRefreshClick(){
        Dispatcher.sendAction('START_REFRESHING_USER');
    };

    userLogin(){
        Dispatcher.sendAction('USER_LOGIN');
    };
    
    userLogout(){
        Dispatcher.sendAction('USER_LOGOUT');
    }

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
        return (
            <main>
                <Topbar 
                  userList={chatStore.state.userList}
                />
                <Navbar 
                    balance={ worldStore.state.user !== undefined ? worldStore.state.user.balance : undefined }
                    user={worldStore.state.user}
                    userLogin={this.userLogin}
                    userLogout={this.userLogout}
                    chatEnabled={worldStore.state.chatEnabled}
                    toggleChat={this.toggleChat}
                    openDepositPopUp={this.openDepositPopUp}
                    openWithdrawPopUp={this.openWithdrawPopUp}
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
}

export default App;


function connectToChatServer() {

  console.log('Connecting to chat server. AccessToken:',
              worldStore.state.accessToken);
  let io = socket(config.chat_uri);

  io.on('connect', function() {
    console.log('Connected');

    io.on('disconnect', function() {
      console.log('Disconnected');
    });

    // When subscribed to DEPOSITS:

    io.on('unconfirmed_balance_change', function(payload) {
      console.log('[socket] unconfirmed_balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        unconfirmed_balance: payload.balance
      });
    });

    io.on('balance_change', function(payload) {
      console.log('[socket] (confirmed) balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        balance: payload.balance
      });
    });

    // message is { text: String, user: { role: String, uname: String} }
    io.on('new_message', function(message) {
      console.log('[socket] Received chat message:', message);
      Dispatcher.sendAction('NEW_MESSAGE', message);
    });

    io.on('user_joined', function(user) {
      console.log('[socket] User joined:', user);
      Dispatcher.sendAction('USER_JOINED', user);
    });

    // `user` is object { uname: String }
    io.on('user_left', function(user) {
      console.log('[socket] User left:', user);
      Dispatcher.sendAction('USER_LEFT', user);
    });

    io.on('new_bet', function(bet) {
      console.log('[socket] New bet:', bet);

      // Ignore bets that aren't of kind "simple_dice".
      if (bet.kind !== 'simple_dice') {
        console.log('[weird] received bet from socket that was NOT a simple_dice bet');
        return;
      }

      Dispatcher.sendAction('NEW_ALL_BET', bet);
    });

    // Received when your client doesn't comply with chat-server api
    io.on('client_error', function(text) {
      console.warn('[socket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    const authPayload = {
      app_id: config.app_id,
      access_token: worldStore.state.accessToken,
      subscriptions: ['CHAT', 'DEPOSITS', 'BETS']
    };

    io.emit('auth', authPayload, function(err, data) {
      if (err) {
        console.log('[socket] Auth failure:', err);
        return;
      }
      console.log('[socket] Auth success:', data);
      Dispatcher.sendAction('INIT_CHAT', data);
    });
  });
}


if (!worldStore.state.accessToken) {
    Dispatcher.sendAction('STOP_LOADING');
    connectToChatServer();
  } else {
    // Load user from accessToken
    MoneyPot.getTokenInfo({
      success: function(data) {
        console.log('Successfully loaded user from tokens endpoint', data);
        var user = data.auth.user;
        Dispatcher.sendAction('USER_LOGIN', user);
      },
      error: function(err) {
        console.log('Error:', err);
      },
      complete: function() {
        Dispatcher.sendAction('STOP_LOADING');
        connectToChatServer();
      }
    });
    // Get next bet hash
    MoneyPot.generateBetHash({
      success: function(data) {
        Dispatcher.sendAction('SET_NEXT_HASH', data.hash);
      }
    });
    // Fetch latest all-bets to populate the all-bets tab
    MoneyPot.listBets({
      success: function(bets) {
        console.log('[MoneyPot.listBets]:', bets);
        Dispatcher.sendAction('INIT_ALL_BETS', bets.reverse());
      },
      error: function(err) {
        console.error('[MoneyPot.listBets] Error:', err);
      }
    });
  }
  
  ////////////////////////////////////////////////////////////
  // Hook up to chat server
   
  
  // This function is passed to the recaptcha.js script and called when
  // the script loads and exposes the window.grecaptcha object. We pass it
  // as a prop into the faucet component so that the faucet can update when
  // when grecaptcha is loaded.
  
  $(document).on('keydown', function(e) {
    var H = 72, L = 76, keyCode = e.which;
  
    // Bail is hotkeys aren't currently enabled to prevent accidental bets
    if (!worldStore.state.hotkeysEnabled) {
      return;
    }
  
    // Bail if it's not a key we care about
    if (keyCode !== H && keyCode !== L && keyCode) {
      return;
    }
  
    // TODO: Remind self which one I need and what they do ^_^;;
    e.stopPropagation();
    e.preventDefault();
  
    switch(keyCode) {
      case L:  // Bet lo
        $('#bet-lo').click();
        break;
      case H:  // Bet hi
        $('#bet-hi').click();
        break;
      default:
        return;
    }
  });
  
  window.addEventListener('message', function(event) {
    if (event.origin === config.mp_browser_uri && event.data === 'UPDATE_BALANCE') {
      Dispatcher.sendAction('START_REFRESHING_USER');
    }
  }, false);
