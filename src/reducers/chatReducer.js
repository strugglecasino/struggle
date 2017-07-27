import CBuffer from 'CBuffer';
import config from '../utils/config.js';
import {
    INIT_CHAT,
    NEW_MESSAGE,
    USER_JOINED,
    USER_LEFT,
    SEND_MESSAGE
} from '../actions/chatActions.js';

const initialState = {
    messages: new CBuffer(config.chat_buffer_size),
    waitingForServer: false,
    userList: {},
    showUserList: false,
    loadingInitialMessages: true
};


export default function chatReducer(state = initialState, action) {
    switch(action.type){
        case INIT_CHAT:
        return action.data;
        case NEW_MESSAGE:
         return action.message;
        case SEND_MESSAGE:
         return action.text;
        default:
         return state;
    }
}