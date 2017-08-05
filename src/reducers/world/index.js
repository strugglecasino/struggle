import CBuffer from 'CBuffer';
import config from '../../utils/config';
import * as types from '../../actions/world/types';
import * as Actions from '../../actions/world';

const initialState = {
    isLoading: true,
    user: undefined,
    hotkeysEnabled: false,
    accessToken: undefined,
    isRefreshingUser: false,
    currTab: 'ALL_BETS',
    bets: new CBuffer(config.bet_buffer_size),
    allBets: new CBuffer(config.bet_buffer_size)
}

export default function worldReducer(state = initialState, action) {

    switch(action.type) {

        case types.UPDATE_USER:
         return state;
        
        case types.USER_LOGIN:
         return state;

        case types.USER_LOGOUT:
         return Actions.userLogout

        case types.CHANGE_TAB:
        
         return Object.assign({}, state, {
             tabName: state.currTab
         })

        case types.TOGGLE_HOTKEYS:

         return Object.assign({}, state, {
             hotkeysEnabled: !state.hotkeysEnabled
         })
        case types.DISABLE_HOTKEYS:

         return Actions.disableHotkeys;

        case types.INIT_ALL_BETS:
        
         return state;
         
        case types.NEW_ALL_BET:
         return state;

        case types.NEW_BET:
         return state;

        case types.START_LOADING:
         return state;

        case types.STOP_LOADING:
         return state;

        case types.START_REFRESHING_USER:
         return state;

        case types.STOP_REFRESHING_USER:
         return state;
 
        default:
         return state;
    }
};