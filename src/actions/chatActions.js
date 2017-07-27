export const INIT_CHAT = 'INIT_CHAT';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const USER_JOINED = 'USER_JOINED';
export const USER_LEFT = 'USER_LEFT';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const TOGGLE_CHAT_USERLIST =  'TOGGLE_CHAT_USERLIST';

export function initChat(data){
    return { 
        type: INIT_CHAT, 
        data
    };
}

export function userJoined(user) {
    return {
        type: USER_JOINED,
        user
    };
}

export function userLeft(user) {
    return {
        type: USER_LEFT,
        user
    };
}

export function toggleChatUserList(){
    return {
        type: TOGGLE_CHAT_USERLIST
    }
}

export function sendMessage(text){
    return {
        type: SEND_MESSAGE,
        text
    };
}
