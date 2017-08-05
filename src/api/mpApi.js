import config from '../utils/config';
import * as helpers from '../utils/helpers';
import axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';



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



const apiVersion = 'v1';


let noop = function() {};
const makeMPRequest = (method, bodyParams, endpoint, callbacks, overrideOpts) => {

let url = config.mp_api_uri + '/' + apiVersion + endpoint;

let dataOpts = {
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
    fetch(dataOpts || overrideOpts)
};



export const listBets = (callbacks, endpoint = '/bets') => {
  fetch(this.dataOpts)
   axios.get(undefined, endpoint, callbacks, {
     data: config.app_id,
     limit: config.bet_buffer_size
   })
}

export const getTokenInfo = (callbacks) => {
    let endpoint = '/token';
    makeMPRequest('GET', undefined, endpoint, callbacks);
};

 export const generateBetHash = (callbacks) => {
    let endpoint = '/hashes';
    makeMPRequest('POST', undefined, endpoint, callbacks);
};

export const getDepositAddress = (callbacks) => {
    var endpoint = '/deposit-address';
    makeMPRequest('GET', undefined, endpoint, callbacks);
};

  // bodyParams is an object:
  // - wager: Int in satoshis
  // - client_seed: Int in range [0, 0^32)
  // - hash: BetHash
  // - cond: '<' | '>'
  // - number: Int in range [0, 99.99] that cond applies to
  // - payout: how many satoshis to pay out total on win (wager * multiplier)
 export const placeSimpleDiceBet = (bodyParams, callbacks) => {
    let endpoint = '/bets/simple-dice';
    makeMPRequest('POST', bodyParams, endpoint, callbacks);
};
