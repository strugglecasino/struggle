import * as types from './types';




export const userLogin = (user) => {
    return {
        type: types.USER_LOGIN,
        user
    }
}

export const userLogout = (user, accesToken, bets) => {
    return {
        type: types.USER_LOGOUT,
        user: undefined,
        accessToken: undefined
    }
}


export const changeTab = (tabName) => {
    return {
        type: types.CHANGE_TAB,
        tabName
    }
}

export const toggleHotkeys = (hotkeysEnabled) => { 
    return {
        type: types.TOGGLE_HOTKEYS,
        hotkeysEnabled
    };
}

export const disableHotkeys = () => {
    return {
        type: types.DISABLE_HOTKEYS
    };
}