import config from '../utils/config';
import _ from 'lodash';
import $ from 'jquery';


let apiVersion = 'v1';

  // method: 'GET' | 'POST' | ...
  // endpoint: '/tokens/abcd-efgh-...'
let noop = function() {};
let makeMPRequest = function(method, bodyParams, endpoint, callbacks, overrideOpts) {
/*
    if (!worldStore.state.accessToken)
      throw new Error('Must have accessToken set to call MoneyPot API');
*/
let url = config.mp_api_uri + '/' + apiVersion + endpoint;
/*
    if (worldStore.state.accessToken) {
      url = url + '?access_token=' + worldStore.state.accessToken;
    }
*/
let ajaxOpts = {
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



export function listBets(callbacks) {
    var endpoint = '/list-bets';
    makeMPRequest('GET', undefined, endpoint, callbacks, {
      data: {
        app_id: config.app_id,
        limit: config.bet_buffer_size
      }
    });
  };

 export function getTokenInfo(callbacks) {
    var endpoint = '/token';
    makeMPRequest('GET', undefined, endpoint, callbacks);
  };

 export function generateBetHash(callbacks) {
    var endpoint = '/hashes';
    makeMPRequest('POST', undefined, endpoint, callbacks);
  };

export function  getDepositAddress(callbacks) {
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
 export function placeSimpleDiceBet(bodyParams, callbacks) {
    var endpoint = '/bets/simple-dice';
    makeMPRequest('POST', bodyParams, endpoint, callbacks);
  };