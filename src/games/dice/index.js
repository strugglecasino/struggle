import React, { Component } from 'react';
import { betStore, worldStore, chatStore } from '../../stores/Store';
import Dispatcher from '../../dispatcher/Dispatcher';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Chatbox from './containers/Chatbox';
import Betbox from './containers/Betbox';
import BetTabsNav from './containers/BetTabsNav';
import BetTabs from './components/tabs/BetTabs';
// import Preloader from '../components/Preloader';
import $ from 'jquery';
import _ from 'lodash';
import config from '../../utils/config';
import io from 'socket.io-client';
const socket = io(config.chat_uri);

export const MoneyPot = (function() {
  
    const o = {};
  
    o.apiVersion = 'v1';
  

    const noop = function() {};
    const makeMPRequest = function(method, bodyParams, endpoint, callbacks, overrideOpts) {
  
      if (!worldStore.state.accessToken)
        throw new Error('Must have accessToken set to call MoneyPot API');
  
      let url = config.mp_api_uri + '/' + o.apiVersion + endpoint;
  
      if (worldStore.state.accessToken) {
        url = url + '?access_token=' + worldStore.state.accessToken;
      }
  
      const ajaxOpts = {
        url:      url,
        dataType: 'json', // data type of response
        method:   method,
        data:     bodyParams ? JSON.stringify(bodyParams) : undefined,
        // By using text/plain, even though this is a JSON request,
        // we avoid preflight request. (Moneypot explicitly supports this)
        headers: {
          'Content-Type': 'text/plain'
        },
        // Callbacks
        success:  callbacks.success || noop,
        error:    callbacks.error || noop,
        complete: callbacks.complete || noop
      };
  
      $.ajax(_.merge({}, ajaxOpts, overrideOpts || {}));
    };
  
    o.listBets = function(callbacks) {
      const endpoint = '/list-bets';
      makeMPRequest('GET', undefined, endpoint, callbacks, {
        data: {
          app_id: config.app_id,
          limit: config.bet_buffer_size
        }
      });
    };
  
    o.getTokenInfo = function(callbacks) {
      const endpoint = '/token';
      makeMPRequest('GET', undefined, endpoint, callbacks);
    };
  
    o.generateBetHash = function(callbacks) {
      const endpoint = '/hashes';
      makeMPRequest('POST', undefined, endpoint, callbacks);
    };
  
    o.getDepositAddress = function(callbacks) {
      const endpoint = '/deposit-address';
      makeMPRequest('GET', undefined, endpoint, callbacks);
    };
  
  
    // bodyParams is an object:
    // - wager: Int in satoshis
    // - client_seed: Int in range [0, 0^32)
    // - hash: BetHash
    // - cond: '<' | '>'
    // - number: Int in range [0, 99.99] that cond applies to
    // - payout: how many satoshis to pay out total on win (wager * multiplier)
    o.placeSimpleDiceBet = function(bodyParams, callbacks) {
      const endpoint = '/bets/simple-dice';
      makeMPRequest('POST', bodyParams, endpoint, callbacks);
    };
  
    return o;
})();

class Dice extends Component {

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
    }
    componentWillUnmount(){
        betStore.off('change', this.onStoreChange);
        worldStore.off('change', this.onStoreChange);
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
 //       Dispatcher.sendAction('USER_JOINED');
    };
    
    userLogout(){
        Dispatcher.sendAction('USER_LOGOUT');
//        Dispatcher.sendAction('USER_LEFT');
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
                <section className="main">
                    <Betbox 
                     MoneyPot={this.MoneyPot}/>
                    <Chatbox />
                </section>
                <div className="tabs">
                    <BetTabsNav />
                    <BetTabs />
                </div>
            </main>
        );
    }
}

export default Dice;


const connectToChatServer = () => {

  console.log('Connecting to chat server. AccessToken:',
     worldStore.state.accessToken);

  socket.on('connect', function() {
    console.log('Connected');

    socket.on('disconnect', function() {
      console.log('Disconnected');
    });

    // When subscribed to DEPOSITS:

    socket.on('unconfirmed_balance_change', function(payload) {
      console.log('[socket] unconfirmed_balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        unconfirmed_balance: payload.balance
      });
    });

    socket.on('balance_change', function(payload) {
      console.log('[socket] (confirmed) balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        balance: payload.balance
      });
    });

    // message is { text: String, user: { role: String, uname: String} }
    socket.on('new_message', function(message) {
      console.log('[socket] Received chat message:', message);
      Dispatcher.sendAction('NEW_MESSAGE', message);
    });

    socket.on('user_joined', function(user) {
      console.log('[socket] User joined:', user);
      Dispatcher.sendAction('USER_JOINED', user);
    });

    // `user` is object { uname: String }
    socket.on('user_left', function(user) {
      console.log('[socket] User left:', user);
      Dispatcher.sendAction('USER_LEFT', user);
    });

    socket.on('new_bet', function(bet) {
      console.log('[socket] New bet:', bet);

      // Ignore bets that aren't of kind "simple_dice".
      if (bet.kind !== 'simple_dice') {
        console.log('[weird] received bet from socket that was NOT a simple_dice bet');
        return;
      }

      Dispatcher.sendAction('NEW_ALL_BET', bet);
    });

    // Received when your client doesn't comply with chat-server api
    socket.on('client_error', function(text) {
      console.warn('[socket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    const authPayload = {
      app_id: config.app_id,
      access_token: worldStore.state.accessToken,
      subscriptions: ['CHAT', 'DEPOSITS', 'BETS']
    };

    socket.emit('auth', authPayload, function(err, data) {
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
