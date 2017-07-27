import CBuffer from 'CBuffer';
import config from '../utils/config';
import _ from 'lodash';
import {
   UPDATE_USER, 
   USER_LOGIN,
   USER_LOGOUT,
   START_LOADING,
   STOP_LOADING, 
   CHANGE_TAB,
   NEW_BET,
   NEW_ALL_BET,
   INIT_ALL_BETS,
   TOGGLE_HOTKEYS,
   DISABLE_HOTKEYS,
   START_REFRESHING_USER, 
   STOP_REFRESHING_USER

} from '../actions/worldActions.js';

import * as Actions from '../actions/worldActions';

const initialState = {
    isLoading: true,
    user: {
        uname: 'FOKUFF',
        balance: '1800'
    },
    hotkeysEnabled: false,
    accessToken: '',
    isRefreshingUser: false,
    currTab: 'ALL_BETS',
    bets: new CBuffer(config.bet_buffer_size),
    allBets: new CBuffer(config.bet_buffer_size)
}

export default function worldReducer(state = initialState, action = Actions) {
    switch(action.type) {

        case UPDATE_USER:
        
         return action.data;
        
        case USER_LOGIN:
        
         return action.user;

        case USER_LOGOUT:
         
         return action.user;

        case CHANGE_TAB:

         return action.tabName;

        case TOGGLE_HOTKEYS:
         return Actions.toggleHotkeys;
        default:
         return state;
    }
};