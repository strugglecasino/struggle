import * as types from './types';


export const initChat = (data) => {
    return {
        type: types.INIT_CHAT,
        data
    }
}


export const userJoined = (user) => {
    return {
        type: types.USER_JOINED,
        user
    };
}

export const userLeft = (user) => {
    return {
        type: types.USER_LEFT,
        user
    };
}

export const toggleChatUserList = () => {
    return {
        type: types.TOGGLE_CHAT_USERLIST
    }
}

export const newMessage = (message) => {
    return {
        type: types.NEW_MESSAGE,
        message
    };
}

export const sendMessage = (text) => {
    return {
        type: types.SEND_MESSAGE,
        text
    };
}
