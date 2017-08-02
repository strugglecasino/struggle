import * as types from '../../actions/chat/types';
import * as Actions from '../../actions/chat';
import config from '../../utils/config';
import CBuffer from 'CBuffer';


const initialState = {
    waitingForServer: true,
    messages: new CBuffer(config.chat_buffer_size),
    userList: [
         {'uname': 'Es2thekay'}
    ], 
    showUserList: true,
    loadingInitialMessages: true
}

const chatReducer = (state = initialState, action) => {

    switch(action.type) {

        case types.INIT_CHAT:
         return Actions.initChat

        case types.USER_JOINED:

         return Actions.userJoined
        
        case types.USER_LEFT:
         
         return state;

        case types.TOGGLE_CHAT_USERLIST:

         return state;
        
        default:
        
         return state;
    }
}

export default chatReducer;