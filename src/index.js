import 'babel-polyfill';
import ReactDOM, { render } from 'react-dom';
import React, { Component } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';
import padStart from 'lodash.padstart';
import $ from 'jquery';
import EventEmitter from 'events';
import CBuffer from 'CBuffer';
import nanoid from 'nanoid';
import SHA256 from 'crypto-js/sha256';

import './less/main.less';
import Logo from "./struggle.svg";

/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url */
/* eslint-disable no-useless-concat */


const config = {
    app_id: 867, 
    app_name: 'struggle',
    redirect_uri: 'https://strugglecasino.github.io/',
    mp_browser_uri: 'https://www.moneypot.com',
    mp_api_uri: 'https://api.moneypot.com',
    chat_uri: '//socket.moneypot.com',
    debug: isRunningLocally(),
    force_https_redirect: !isRunningLocally(),
    house_edge: 0.01
};
  
  (function() {
    var errString;
  
    if (config.house_edge <= 0.0) {
      errString = 'House edge must be > 0.0 (0%)';
    } else if (config.house_edge >= 100.0) {
      errString = 'House edge must be < 1.0 (100%)';
    }
  
    if (errString) {
      alert(errString);
      throw new Error(errString);
    }
    
    // Sanity check: Print house edge
    console.log('House Edge:', (config.house_edge * 100).toString() + '%');
  })();
  
if (config.force_http_redirect && window.location.protocol !== "https:") {
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
};
  
function isRunningLocally() {
    return /^localhost/.test(window.location.host);
};
  




const helpers = {};

helpers.formatDateToTime = function(dateJson) {
  var date = new Date(dateJson);
  return padStart(date.getHours().toString(), 2, '0') +
    ':' +
    padStart(date.getMinutes().toString(), 2, '0');
};
  
  // Number -> Number in range (0, 1)
helpers.multiplierToWinProb = function(multiplier) {
    console.assert(typeof multiplier === 'number');
    console.assert(multiplier > 0);
  
    // For example, n is 0.99 when house edge is 1%
    let n = 1.0 - config.house_edge;
  
    return n / multiplier;
  };
  
helpers.calcNumber = function(cond, winProb) {
    console.assert(cond === '<' || cond === '>');
    console.assert(typeof winProb === 'number');
  
    if (cond === '<') {
      return winProb * 100;
    } else {
      return 99.99 - (winProb * 100);
    }
  };
  
helpers.roleToLabelElement = function(role) {
    switch(role) {
      case 'ADMIN':
        return <span id='admin'> ADMIN </span>;
      case 'MOD':
        return <span id='mod'> MOD </span>;
      case 'OWNER':
        return <span id='owner'> OWNER </span>;
      case 'VIP':
        return <span id='vip'> VIP </span>; 
      default:
        return '';
    }
  };
  
  // -> Object


helpers.getHashParams = function() {
    let hashParams = {};
    let e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);
    while(e = r.exec(q))
      hashParams[d(e[1])] = d(e[2]);
    return hashParams;
};
  
  // getPrecision('1') -> 0
  // getPrecision('.05') -> 2
  // getPrecision('25e-100') -> 100
  // getPrecision('2.5e-99') -> 100
helpers.getPrecision = function(num){
    let match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0) -
      // Adjust for scientific notation.
      (match[2] ? +match[2] : 0));
};
  
  
helpers.decimalAdjust = function(type, value, exp)  {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
};
  
helpers.round10 = function(value, exp)  {
    return helpers.decimalAdjust('round', value, exp);
};
  
helpers.floor10 = function(value, exp) {
    return helpers.decimalAdjust('floor', value, exp);
 };
  
helpers.ceil10 = function(value, exp)  {
    return helpers.decimalAdjust('ceil', value, exp);
};

let access_token, expires_in, expires_at;

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
    console.log('[Token manager] access_token removed from localStorage');
  }
} else {
  console.log('[token manager] no access token');
};

  
let Dispatcher, worldStore, chatStore, betStore;

const MoneyPot = (function() {
    
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

class Store extends EventEmitter {
    constructor(storeName, initState, initCallback) {
      super(storeName, initState, initCallback);
      this.state = initState;
      this.emitter = new EventEmitter();
      initCallback.call(this);
  
      const self = this;
  
      this.on = (eventName, cb) => {
        self.emitter.on(eventName, cb);
      }
      this.off = (eventName, cb) => {
        self.emitter.off(eventName, cb);
      }
    }
  };

Dispatcher = new (function() {
    // Map of actionName -> [Callback]
    this.callbacks = {};
  
    let self = this;
  
    this.registerCallback = function(actionName, cb) {
  
      if (!self.callbacks[actionName]) {
        self.callbacks[actionName] = [cb];
      } else {
        self.callbacks[actionName].push(cb);
      }
    };
  
    this.sendAction = function(actionName, payload) {
  
      // Ensure this action has 1+ registered callbacks
      if (!self.callbacks[actionName]) {
        throw new Error('Unsupported actionName: ' + actionName);
      }
  
      // Dispatch payload to each registered callback for this action
      self.callbacks[actionName].forEach(function(cb) {
        cb(payload);
      });
    };
})();
  
  
  /* CHATSTORE */

chatStore = new Store('chat', {
    messages: new CBuffer(250),
    waitingForServer: false,
    userList: [],
    showUserList: false,
    loadingInitialMessages: true
  }, function() {
    
    const self = this;

    // `data` is object received from socket auth
    Dispatcher.registerCallback('INIT_CHAT', function(data) {
      console.log('[ChatStore] received INIT_CHAT');
      // Give each one unique id
      const messages = data.chat.messages.map((message) => {
        message.id = nanoid(16);
        return message;
      });
  
      // Reset the CBuffer since this event may fire multiple times,
      // e.g. upon every reconnection to chat-server.
      self.state.messages.empty();
  
      self.state.messages.push.apply(self.state.messages, messages);
  
      // Indicate that we're done with initial fetch
      self.state.loadingInitialMessages = false;
  
      // Load userList
      self.state.userList = data.chat.userlist;
      self.emitter.emit('change', self.state);
      self.emitter.emit('init');
    });
  
    Dispatcher.registerCallback('NEW_MESSAGE', function(message) {
      console.log('[ChatStore] received NEW_MESSAGE');
      message.id = nanoid(16);
      self.state.messages.push(message);
  
      self.emitter.emit('change', self.state);
      self.emitter.emit('new_message');
    });
  
    Dispatcher.registerCallback('TOGGLE_CHAT_USERLIST', () => {
      console.log('[ChatStore] received TOGGLE_CHAT_USERLIST');
      self.state.showUserList = !self.state.showUserList;
      self.emitter.emit('change', self.state);
    });
  
    // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
    Dispatcher.registerCallback('USER_JOINED', (user) => {
      console.log(user + ' joined');
      self.state.userList[user.uname] = user;
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('TOGGLE_BETBOT', () => {
      console.log('betbox enabled');
      self.state.botEnabled = !self.state.botEnabled;
      self.emitter.emit('change', self.state);
    })
    // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
    Dispatcher.registerCallback('USER_LEFT', (user) => {
      console.log(user + ' left');
      delete self.state.userList[user.uname];
      self.emitter.emit('change', self.state);
    });
  
    // Message is { text: String }
    Dispatcher.registerCallback('SEND_MESSAGE', function(text) {
      console.log('[Dispatcher] Send message');
      self.state.waitingForServer = true;
      self.emitter.emit('change', self.state);
      let socket = io(config.chat_uri);
      socket.emit('new_message', { text: text }, function(err) {
        if (err) {
          alert('Chat Error: ' + err);
        }
      });
    });
});
  
  
  /* BETSTORE */
  
betStore = new Store('bet', {
    nextHash: undefined,
    wager: {
      str: '1',
      num: 1,
      error: undefined
    },
    multiplier: {
      str: '2.00',
      num: 2.00,
      error: undefined
    }
  }, function() {
  
    const self = this;
  
    Dispatcher.registerCallback('SET_NEXT_HASH', function(hexString) {
      self.state.nextHash = hexString;
      self.emitter.emit('change', self.state);
    });
  
  
    Dispatcher.registerCallback('UPDATE_WAGER', function(newWager) {
      self.state.wager = _.merge({}, self.state.wager, newWager);
  
      let n = parseInt(self.state.wager.str, 10);
  
      // If n is a number, ensure it's at least 1 bit
      if (isFinite(n)) {
        n = Math.max(n, 1);
        self.state.wager.str = n.toString();
      }
  
      // Ensure wagerString is a number
      if (isNaN(n) || /[^\d]/.test(n.toString())) {
        self.state.wager.error = 'INVALID_WAGER';
      // Ensure user can afford balance
      } else if (worldStore.state.user !== undefined ? n * 100 > worldStore.state.user.balance : '') {
        self.state.wager.error = 'CANNOT_AFFORD_WAGER';
        self.state.wager.num = n;
      } else {
        // wagerString is valid
        self.state.wager.error = null;
        self.state.wager.str = n.toString();
        self.state.wager.num = n;
      }
  
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('UPDATE_MULTIPLIER', function(newMult) {
      self.state.multiplier = _.merge({}, self.state.multiplier, newMult);
      self.emitter.emit('change', self.state);
    });
});
  
worldStore = new Store('world', {
    isLoading: true,
    user: undefined,
    accessToken: access_token,
    isRefreshingUser: false,
    hotkeysEnabled: false,
    botEnabled: false,
    chatEnabled: true,
    currTab: 'ALL_BETS',
    // TODO: Turn this into myBets or something
    bets: new CBuffer(25),
    // TODO: Fetch list on load alongside socket subscription
    allBets: new CBuffer(25)
  }, function() {
  
    const self = this;
  
    // TODO: Consider making these emit events unique to each callback
    // for more granular reaction.
  
    // data is object, note, assumes user is already an object
    Dispatcher.registerCallback('UPDATE_USER', function(data) {
      self.state.user = _.merge({}, self.state.user, data);
      self.emitter.emit('change', self.state);
    });
  
    // deprecate in favor of SET_USER
    Dispatcher.registerCallback('USER_LOGIN', function(user) {
      self.state.user = user;
      self.emitter.emit('change', self.state);
      self.emitter.emit('user_update');
    });
  
    // Replace with CLEAR_USER
    Dispatcher.registerCallback('USER_LOGOUT', function() {
      self.state.user = undefined;
      self.state.accessToken = undefined;
      localStorage.removeItem('expires_at');
      localStorage.removeItem('access_token');
      self.state.bets.empty();
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('START_LOADING', function() {
      self.state.isLoading = true;
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('STOP_LOADING', function() {
      self.state.isLoading = false;
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('CHANGE_TAB', function(tabName) {
      console.assert(typeof tabName === 'string');
      self.state.currTab = tabName;
      self.emitter.emit('change', self.state);
    });
  
    // This is only for my bets? Then change to 'NEW_MY_BET'
    Dispatcher.registerCallback('NEW_BET', function(bet) {
      console.assert(typeof bet === 'object');
      self.state.bets.push(bet);
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('NEW_ALL_BET', function(bet) {
      self.state.allBets.push(bet);
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('INIT_ALL_BETS', function(bets) {
      console.assert(_.isArray(bets));
      self.state.allBets.push.apply(self.state.allBets, bets);
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('TOGGLE_HOTKEYS', function() {
      self.state.hotkeysEnabled = !self.state.hotkeysEnabled;
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('TOGGLE_CHAT', function() {
      self.state.chatEnabled = !self.state.chatEnabled;
      self.emitter.emit('change', self.state);
    });
  
    Dispatcher.registerCallback('DISABLE_HOTKEYS', function() {
      self.state.hotkeysEnabled = false;
      self.emitter.emit('change', self.state);
    });
  
  
    Dispatcher.registerCallback('START_REFRESHING_USER', function() {
      self.state.isRefreshingUser = true;
      self.emitter.emit('change', self.state);
      MoneyPot.getTokenInfo({
        success: function(data) {
          console.log('Successfully loaded user from tokens endpoint', data);
          const user = data.auth.user;
          self.state.user = user;
          self.emitter.emit('change', self.state);
          self.emitter.emit('user_update');
        },
        error: function(err) {
          console.log('Error:', err);
        },
        complete: function() {
          Dispatcher.sendAction('STOP_REFRESHING_USER');
        }
      });
    });
  
    Dispatcher.registerCallback('STOP_REFRESHING_USER', function() {
      self.state.isRefreshingUser = false;
      self.emitter.emit('change', self.state);
    });
  
  });
  
  class Loader extends Component {
    render() {
        return (
            <section className="loader">
                <div className="loader_inner">
                       <figure id="circle1"></figure>
                        <figure id="circle2"></figure>
                       <figure id="circle3"></figure>
               </div>
            </section>
        );
    }
};



class ChatboxForm extends Component {
    constructor(props) {
        super(props);
        this.state = { text : ''}
        this.onStoreChange = this.onStoreChange.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
    };
    onStoreChange(){
        this.forceUpdate();
    };
    componentDidMount(){
        chatStore.on('change', this.onStoreChange);
        worldStore.on('change', this.onStoreChange);
    };
    componentWillUnmount(){
        chatStore.off('change', this.onStoreChange);
        worldStore.off('change', this.onStoreChange);
    };
    onChange(e){
        this.setState({text: e.target.value});
    };
    onSend(){
        const self = this;
        Dispatcher.sendAction('SEND_MESSAGE', this.state.text);
        this.setState({text: ''});
    };
    onKeyPress(e) {
        const ENTER = 13;
        if (e.which === ENTER) {
          if (this.state.text.trim().length > 0) {
            this.onSend();
          }
       }
    }
    onFocus() {
        if(worldStore.state.hotkeysEnabled) {
          Dispatcher.sendAction('DISABLE_HOTKEYS');
        };
    }
    render() {
        return (
            <section className="chatbox_form">
                { chatStore.state.loadingInitialMessages ? <Loader /> :
                <input
                  type='text'
                  value={this.state.text}
                  onChange={this.onChange}
                  onKeyPress={this.onKeyPress}
                  onFocus={this.onFocus}
                  ref='input'
                  placeholder={worldStore.state.user !== undefined ? 'Type here...' : 'Login to chat'}
                />
                }
                <button 
                   type="button" 
                   disabled={worldStore.state.user === undefined
                   || chatStore.state.loadingInitialMessages 
                   || this.state.text.trim().length === 0}
                   onClick={this.onSend}>        
                    <i className="icon-icon_paperplane_line"></i>
                </button>
            </section>
        );
    }
};

const ChatboxUserList = () => {
  let userListClass = 'chatbox_userlist';
  if(!chatStore.state.showUserList) {
    userListClass += ' hide_userlist';
  };
    return(
        <ul className={userListClass}>
            {
                _.values(chatStore.state.userList).map((u) =>  {
                    return (
                        <li key={u.uname }>
                            <a href={config.mp_browser_uri + '/users/' + u.uname }>
                                {  u.uname }
                           </a>
                        </li>
                    )
                })
            }
        </ul>
    );
}

const ChatboxHeader = ({toggleChatUserList, showUserList}) => {
    let textOptions;
    if(showUserList) {
        textOptions = 'HIDE USERS';
    } else {
        textOptions = 'SHOW USERS'
    };
    return(
        <section className="chatbox_header" >
            <button onClick={toggleChatUserList}>  
              <span> { textOptions } </span>
              <i className={ showUserList ? 'icon-icon_eye_cross_line' : 'icon-icon_eye_line'}></i>
            </button>
        </section>
    );
};

// Chatbox

class Chatbox extends Component {
    constructor(props){
        super(props);
        this.toggleChatUserList = this.toggleChatUserList.bind(this);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.scrollChat = this.scrollChat.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
    };
    onStoreChange(){
        this.forceUpdate();
    };
    onNewMessage() {
        const node = ReactDOM.findDOMNode(this.refs.chatListRef);
    
        // Only scroll if user is within 100 pixels of last message
          const shouldScroll = function() {
          let distanceFromBottom = node.scrollHeight - ($(node).scrollTop() + $(node).innerHeight());
          console.log('DistanceFromBottom:', distanceFromBottom);
          return distanceFromBottom <= 100;
        };
    
        if (shouldScroll()) {
          this.scrollChat();
        };
    };
    scrollChat() {
        const node = ReactDOM.findDOMNode(this.refs.chatListRef);
        $(node).scrollTop(node.scrollHeight);
    };
    componentDidMount(){
        chatStore.on('change', this.onStoreChange);
        chatStore.on('new_message', this.onNewMessage);
        chatStore.on('init', this.scrollChat);
        worldStore.on('change', this.onStoreChange);
    };
    componentWillUnmount(){
        chatStore.off('change', this.onStoreChange);
        chatStore.off('new_message', this.onNewMessage);
        chatStore.off('init', this.scrollChat);
        worldStore.off('change', this.onStoreChange);
    };

    toggleChatUserList(){
        Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
    }

    render() {

      let chatboxClass = 'chatbox'; 
      if(!worldStore.state.chatEnabled) {
          chatboxClass += ' chat_hidden';
      };

    return (
            <section className={chatboxClass}>


                 <ChatboxHeader  
                    showUserList={chatStore.state.showUserList}
                    toggleChatUserList={this.toggleChatUserList}
                 />
                
                 <ChatboxUserList />

                <ul className="chatbox_messages" ref="chatListRef">
                    {
                        chatStore.state.messages.toArray().map((m) => {
                            return (
                              <li key={m.id} className="chatbox_message">
                                <div id="info">
                                <span className="role" id={m.role}> { m.role }</span>
                                <a id="sender" href={config.mp_browser_uri + '/users/' + m.uname }>
                                     { m.uname } 
                                </a>   
                                <span id="time"> { helpers.formatDateToTime(m.created_at) } </span>
                              </div>
                              <div id="text" > 
                                  { m.text }
                              </div>
                            </li>
                            );
                        })
                    }
                </ul>

                <ChatboxForm />

            </section>
        );
    }
};

//BetboxRolLButtons

class BetboxRollButtons extends Component {
    constructor(props) {
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.makeBetHandler = this.makeBetHandler.bind(this);
    }
 onStoreChange(){
     this.forceUpdate();
 }
 componentDidMount(){
     betStore.on('change', this.onStoreChange);
     worldStore.on('change', this.onStoreChange);
 };
 
 componentWillUnmount(){
     betStore.off('change', this.onStoreChange);
     worldStore.off('change', this.onStoreChange);
 }

 makeBetHandler(cond){
     
    const self = this;
    
    console.assert(cond === '<' || cond === '>');

     return function(e)  {
         console.log('Placing bet..');

         Dispatcher.sendAction('WAITING_FOR_SERVER');
         
         const hash = betStore.state.nextHash;
         console.assert(typeof hash === 'string');


         const wagerSatoshis = betStore.state.wager.num * 100;
         const multiplier = betStore.state.multiplier.num;
         const payoutSatoshis = wagerSatoshis * multiplier;

         const number = helpers.calcNumber(
             cond, helpers.multiplierToWinProb(multiplier)
         )

         const params = {
             wager: wagerSatoshis,
             client_seed: 0,
             hash: hash,
             cond: cond,
             target: number,
             payout: payoutSatoshis
         };

         MoneyPot.placeSimpleDiceBet(params, {
             success: function(bet){
                 console.log('Successfuly placed bet', bet);

                 bet.meta = {
                     cond: cond,
                     number: number,
                     hash: hash,
                     isFair: SHA256(bet.secret + '|' + bet.salt).toString() === hash
                 };

                 bet.wager = wagerSatoshis;
                 bet.uname = worldStore.state.user.uname;

                 Dispatcher.sendAction('NEW_BET', bet);
                 Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
                 Dispatcher.sendAction('UPDATE_USER', {
                     balance: worldStore.state.user.balance + bet.profit
                 });
             },
             error: function(xhr){
                 console.log('Error');
                 if(xhr.responseJSON.error && xhr.responsJSON.error) {
                     alert(xhr.responseJSON.error);
                 } else {
                     alert('Internal error');
                 }
             },
             complete: function(){
                 chatStore.state.waitingForServer = false;
                 Dispatcher.sendAction('UPDATE_WAGER', {
                     str: betStore.state.wager.str
                 });
             }
         })
     }
 }
 render(){
    return (
        <section className='betbox_roll_buttons'>
            <button 
               id="roll_lo"
               onClick={this.makeBetHandler('<')}>
                LO 
                { worldStore.state.hotkeysEnabled ? <kbd> 'L' </kbd> : '' }
            </button>
            <button 
            id="roll_hi"
            onClick={this.makeBetHandler('>')}>
                HI
                { worldStore.state.hotkeysEnabled ? <kbd> 'H' </kbd> : '' }
            </button>
        </section>
    );
   }
};

class BetboxRisk extends Component {
  render() {
    return (
      <section className="betbox_child">
      <span id="label"> RISK </span>
      <div className="input_group">
          <label>
             <i className="icon-icon_pourcent_line"></i>
          </label>
          <input
            value={this.props.risk}
            onChange={this.props.onChange}
          />
      </div>
      <div className="bet_btns"></div>
  </section>     
    );
  }
};

class BetboxProfit extends Component {
  
  render() {
    return (
        <section className="betbox_child">
            <span id="label"> ON WIN </span>
            <div className="input_group">
                <label>
                    <i className="icon-icon_btc_line"></i>
                </label>
                <input
                    value={ this.props.profit }
                    onChange={this.props.onChange}
                />
            </div>
            <div className="bet_btns"></div>
        </section>
    );
  }
};

const Hotkeys = ({ toggleHotkeys}) => {
    let hotkeysClass;
    if(worldStore.state.hotkeysEnabled) {
      hotkeysClass = 'active';
    };

    return (
        <section className="hotkeys">
            <button
            className={ hotkeysClass }  
            onClick={toggleHotkeys}> HOTKEYS </button>
        </section>
    );
};


const BetboxWager = ({worldStore, betStore, onWagerChange, doubleWager, maxWager}) => {
    return (
    <section className="betbox_child">
        <span id="label"> TOTAL BET </span>
        <div className="input_group">
            <label>
                <i className="icon-icon_btc_line"></i>
            </label>
                <input 
                 type="text"
                 value={betStore.state.wager.error ? '?' : betStore.state.wager.str}
                 onChange={onWagerChange}
                 disabled={!!worldStore.state.isLoading}
                 />
            </div>
            <div className="bet_btns">

            </div>
    </section>            
    );
};


const BetboxMultiplier = ({betStore, worldStore, onMultiplierChange, minMultiplier, halveMultiplier, doubleMultiplier, maxMultiplier}) => {
    return (
       <section className="betbox_child">
           <span id="label"> MULTIPLIER </span>
           <div className="input_group">
               <label>
                  <i className="icon-icon_x_line"></i>
               </label>
                   <input 
                    type="text"
                    value={betStore.state.multiplier.error ? '?' : betStore.state.multiplier.str}
                    onChange={onMultiplierChange}
                    disabled={!!worldStore.state.isLoading}
                    />
                </div>
                  <div className="bet_btns">
                 </div>
       </section>
   );
};


/*
const BetboxRobot = ({ betbotClass, onRollsLImitChange }) => {
    
        return (
            <div className={betbotClass}>
                <div className="input_group">
                    <i className="icon-icon_dial_line"></i>
                    <label> ROLLS </label>
                    <input
                     type="text"
                     value="5"
                     onChange={onRollsLImitChange}
                    />
                </div>
            </div>
        );
};
*/

    
const BetboxOutcome = () => {
    
        return (
            <section className="betbox_outcome">
    
                <span id="tooltip"> 00.00 </span>


            </section>
        );
};

// Betbox

class Betbox extends Component {
    constructor(props){
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.onBalanceChange = this.onBalanceChange.bind(this);
        this.onWagerChange = this.onWagerChange.bind(this);
        this.onMultiplierChange = this.onMultiplierChange.bind(this);
        this.validateMultiplier = this.validateMultiplier.bind(this);
        this.toggleHotkeys = this.toggleHotkeys.bind(this);
        this.toggleBetbot = this.toggleBetbot.bind(this);
        this.getErrorMsg = this.getErrorMsg.bind(this);
    
    };

    onStoreChange(){
        this.forceUpdate();
    };

    onBalanceChange(){
        Dispatcher.sendAction('UPDATE_WAGER', {});
    }

    componentDidMount(){
        betStore.on('change', this.onStoreChange);
        worldStore.on('user_update', this.onBalanceChange);
        worldStore.on('change', this.onStoreChange);
    };
    componentWillUnmount(){
        betStore.off('change', this.onStoreChange);
        worldStore.off('user_update', this.onBalanceChange);
        worldStore.off('change', this.onStoreChange);
    };

    onWagerChange(e){
        let str = e.target.value;
        Dispatcher.sendAction('UPDATE_WAGER', { str: str});
    };
    minWager(){
        let newWager = 10;
        Dispatcher.sendAction('UPDATE_WAGER', {str: newWager});
    };
    halveWager(){
        let n = Math.round(betStore.state.wager.num / 2);
        Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString()});
    };
    doubleWager(){
        let str = betStore.state.wager.num * 2;
        Dispatcher.sendAction('UPDATE_WAGER', { str: str.toString()});
    };
    maxWager(){
        let balanceBit;
        if(worldStore.state.user !== undefined){
            balanceBit = Math.floor(worldStore.state.user.balance);
        } else {
            balanceBit = 44000;
        };
        Dispatcher.sendAction('UPDATE_WAGER', { str: balanceBit.toString()});
    };
    validateMultiplier(newStr) {

        const num = parseFloat(newStr, 10);
        
        const isFloatRegexp = /^(\d*\.)?\d+$/;
        
        if (isNaN(num) || !isFloatRegexp.test(newStr)) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
        
        } else if (num < 1.01) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
        
        } else if (num > 9900) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
        
        } else if (helpers.getPrecision(num) > 2) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
        
        } else {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', {
                
                num: num,
                error: null
            
            });
        };
    };
    
    onMultiplierChange(e) {
        const str = e.target.value;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: str });
        this.validateMultiplier(str);
    };
    
    minMultiplier(){
        let minMult = 1.02;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: minMult.toString()});
    };
        
    halveMultiplier(){
        let newMult = Math.round(betStore.state.multiplier.num / 2);
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: newMult.toString()});
    };

    doubleMultiplier(){
        let n = (betStore.state.multiplier.num * 2);
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: n.toString()});
    };

    maxMultiplier(){
        let max = '9900';
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: max.toString()});
    };
    
    toggleHotkeys(){
        Dispatcher.sendAction('TOGGLE_HOTKEYS');
    };
    toggleBetbot(){
        Dispatcher.sendAction('TOGGLE_BETBOT');
    }    
    getErrorMsg(){
        const error = betStore.state.wager.error || betStore.state.multiplier.error;
        const translateErrors = {
            'CANNOT_AFFORD_WAGER': 'BALANCE TOO LOW.',
            'INVALID_WAGER': 'BET IS INVALID.',
            'INVALID_MULTIPLIER': 'MULTIPLIER IS INVALID',
            'MULTIPLIER_TOO_PRECISE': 'MULTIPLIER IS TOO PRECISE.',
            'MULTIPLIER_TOO_HIGH': 'MULTIPLIER IS TOO HIGH, MAXIMUM IS 9900 X.',
            'MULTIPLIER_TOO_LOW': 'MULTIPLIER IS TOO LOW, MINIMUM IS 1.02 X'            
        };
        if(error){
            return translateErrors[error];
        };
    };

    render() {


        let betboxClass = 'betbox';
        if(!worldStore.state.chatEnabled) {
          betboxClass += ' full';
        }

        const error = betStore.state.wager.error || betStore.state.multiplier.error;
        const winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
        let profit;
        let risk;
        if(error) {
            profit = '?'
            risk = '?';
        } else {
            profit = betStore.state.wager.num * (betStore.state.multiplier.num);
            risk = (winProb * 100).toFixed(2).toString();
        };
    
        return (
            <section className={betboxClass}>
                
                
               <div className={ !error ? '' : 'error_messages'}> <span> {  this.getErrorMsg()  } </span> </div> 
        

                <BetboxOutcome 
                   bets={worldStore.state.bets} 
                   onChange={this.onStoreChange} 
                />

                <Hotkeys 
                  toggleHotkeys={this.toggleHotkeys}
                  hotkeysEnabled={worldStore.state.hotkeysEnabled} 
                />


                <BetboxWager 
                  betStore={betStore}
                  worldStore={worldStore}
                  onWagerChange={this.onWagerChange}
                  minWager={this.minWager}
                  halveWager={this.halveWager}
                  doubleWager={this.doubleWager}
                  maxWager={this.maxWager}
                />

                <BetboxMultiplier 
                  betStore={betStore}
                  worldStore={worldStore}
                  onMultiplierChange={this.onMultiplierChange}
                  minMultiplier={this.minMultiplier}
                  halveMultiplier={this.halveMultiplier}
                  doubleMultiplier={this.doubleMultiplier}
                  maxMultiplier={this.maxMultiplier}

                />

                <BetboxProfit
                    profit={profit}
                    onChange={this.onStoreChange}
                 />

                 <BetboxRisk 
                   risk={risk}
                   onChange={this.onStoreChange}
                 />

                <BetboxRollButtons />

                
            </section>
        );
    }
};


class AllBetsTab extends Component {
    constructor(props){
        super(props);
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
    render () {
        return (
        <table className="table">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> TIME </th>
                    <th> USER </th>
                    <th> BET </th>
                    <th> TARGET </th>
                    <th> ROLL </th>
                    <th> PROFIT </th>
                </tr>
            </thead>
            <tbody>
                {
                    worldStore.state.allBets.toArray().map((bet) => {
                        return <BetRow key={bet.bet_id || bet.id} bet={bet}/>
                    }).reverse()
                }
            </tbody>
        </table>
    );
  }
};

const BetRow = ({bet, user}) => {
    return (
        <tr>
            <td>
                <a href={config.mp_browser_uri + '/' + bet.id }>
                 { bet.bet_id || bet.id }
                </a>
            </td>
            <td>
                { helpers.formatDateToTime(bet.created_at) }
            </td>
            <td>
              <a href={config.mp_browser_uri + '/users/' + bet.uname } target="_blank">      
                   { bet.uname }
              </a>
            </td>
            <td>
                { helpers.round10(bet.wager/100, -2) + ' ' } bits
            </td>
            <td>
                { bet.cond + bet.target.toFixed(2) }
            </td>
            <td>
                { bet.outcome }
            </td>
            <td>
                <span className={bet.profit > 0 ? 'win' : 'lose' }> 
                    { helpers.round10(bet.profit/100, -2) + ' ' } bits
                </span>
            </td>

        </tr>
    );
};

const BetTabs = ({ tabName }) => {
    switch(tabName) {
        case 'MY_BETS':
         return <MyBetsTab />;
        case 'ALL_BETS':
         return <AllBetsTab />;
        default:
         return <AllBetsTab />;
    }
};

class MyBetsTab extends Component {
    constructor(props){
        super(props);
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
    render () {
        return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> TIME </th>
                    <th> USER </th>
                    <th> BET </th>
                    <th> TARGET </th>
                    <th> ROLL </th>
                    <th> PROFIT </th>
                </tr>
            </thead>
            <tbody>
                {
                    worldStore.state.bets.toArray().map((bet) => {
                        return <BetRow key={bet.bet_id || bet.id} bet={bet}/>
                    }).reverse()
                }
            </tbody>
        </table>
    );
  }
};




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
  };
};


const Topbar = ({userList}) => {
    return (
        <section className="topbar">
            <div className="topbar_side">
                BTC / USD 
                <span>
                    ?
                </span>
            </div>
            <div className="topbar_side">
             USERS ONLINE
            <span>
            {
                Object.keys(userList).length + ' '
            }
            </span>
        </div>
        </section>
    );
};


class Dropdown extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false
        };
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
        let { user, userLogout, openWithdrawPopUp, openDepositPopUp } = this.props;
        let dropDownMenuClass = 'menu';
        if(this.state.isOpen) {
            dropDownMenuClass += ' open';
        }
        return (
            <section className='dropdown'>
                <button className="dropdown_toggle" onClick={this.dropDownToggle}>
                    { user.uname + ' ' }  <i className="icon-icon_chevron_line"></i>
                </button>
                <ul className={dropDownMenuClass}>
                    <li>
                        <button onClick={openDepositPopUp}>
                            <i className='icon-icon_wallet_plus_line'></i>
                            DEPOSIT
                        </button>
                    </li>

                    <li>
                        <button onClick={openWithdrawPopUp}>
                            <i className="icon-icon_wallet_minus_line"></i>
                            CASHOUT
                        </button>
                    </li>
                    <li>
                        <button onClick={userLogout}> 
                            <i className="icon-icon_arrow_right_line"></i>
                            LOGOUT 
                        </button>
                    </li>
                </ul>
            </section>
        );
    }
};

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
   };
};

const ToggleChat = ({onClick, chatEnabled}) => {
    let toggleIcon;
    if(chatEnabled) {
        toggleIcon = 'icon-icon_cross_chat_line';
    } else {
        toggleIcon = 'icon-icon_chat_line';
    }
    return (
        <button 
          id="toggle_chat"
          onClick={onClick}>
            <i className={toggleIcon}> </i>
        </button>
    );
};


// Navbar

const Navbar = ({ user, chatEnabled,userLogin, userLogout, openDepositPopUp, openWithdrawPopUp, toggleChat }) => {
    return (
    <section className="navbar">

        <div className="navbar_side">
            { user ? <BetboxBalance  />  : '' }
        </div>
        <div className="navbar_center">
            <a href="/">
                 <img src={Logo} alt="struggle"/>
            </a>
        </div>
        <div className="navbar_side">
             { 
                 user ? 
                        <div id="user_info">

                        <ToggleChat
                           onClick={toggleChat}
                           chatEnabled={chatEnabled}
                         />
                        <Dropdown 
                          openWithdrawPopUp={openWithdrawPopUp}
                          openDepositPopUp={openDepositPopUp}
                          userLogout={userLogout} 
                          user={user}
                        /> 
                    </div>
                : 
                 <div id="side_btns"> 
                     <a  
                         onClick={userLogin}
                         href={config.mp_browser_uri + 
                         '/oauth/authorize' + '?app_id=' + config.app_id
                          + '&redirect_uri=' + config.redirect_uri}> 
                         LOGIN 
                     </a> 
                     or 
                     <a href={config.mp_browser_uri + '/register/'}>   REGISTER 
                     </a>
                 </div> 
             }
        </div>
    </section>
  );

};

// App

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

        onStoreChange(){
            this.forceUpdate();
        };
    
        componentDidMount(){
            betStore.on('change', this.onStoreChange);
            worldStore.on('change', this.onStoreChange);
        }
        componentWillUnmount(){
            betStore.off('change', this.onStoreChange);
            worldStore.off('change', this.onStoreChange);
        };
    
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
                <div>
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
                        <Betbox />
                        <Chatbox />
                    </section>
                    <div className="tabs">
                        <BetTabsNav />
                        <BetTabs />
                    </div>
                </main>
            </div>
            );
      };
};
    
    
const connectToChatServer = function(){
    
      console.log('Connecting to chat server. AccessToken:',
         worldStore.state.accessToken);

      let socket = io(config.chat_uri);

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
};
    
    
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
};
      
    

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

$(document).ready(function() {
    $('#preloader').fadeOut(600, function(){$(this).remove(); });
});

const root = document.getElementById('root');

render(
  <App />, root
)