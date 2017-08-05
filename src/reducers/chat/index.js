import * as types from '../../actions/chat/types';
import * as Actions from '../../actions/chat';
import config from '../../utils/config';
import CBuffer from 'CBuffer';


const initialState = {
    waitingForServer: true,
    messages: new CBuffer(config.chat_buffer_size),
    userList: {},
    showUserList: false,
    loadingInitialMessages: true
}

const chatReducer = (state = initialState, action) => {

    switch(action.type) {

        case types.INIT_CHAT:
         return Actions.initChat

        case types.USER_JOINED:
         let user = state.userList[this.props.user.uname];
         return Object.assign({}, state, {
             user: user
         })
        
        case types.USER_LEFT:
         
         return Object.assign({}, state, {
             userList: state.userList
         })

        case types.TOGGLE_CHAT_USERLIST:

         return Object.assign({}, state, {
             showUserList: !state.showUserList
         });

        default:
        
         return state;
    }
}

export default chatReducer;