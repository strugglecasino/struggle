import * as types from '../../actions/chat/types';
// import * as Actions from '../../actions/chat';
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

         return state;
        
        case types.USER_JOINED:

         return state;
        
        case types.USER_LEFT:
         
         return state;

        case types.TOGGLE_CHAT_USERLIST:

         return state;
        
        default:
        
         return state;
    }
}

export default chatReducer;