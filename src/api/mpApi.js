import { worldStore } from '../stores/Store';
import _ from 'lodash';
import config from '../utils/config';
import $ from 'jquery';

const MoneyPot = (function() {
    
      const o = {};
    
      o.apiVersion = 'v1';
    
      // method: 'GET' | 'POST' | ...
      // endpoint: '/tokens/abcd-efgh-...'
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


export default MoneyPot;
