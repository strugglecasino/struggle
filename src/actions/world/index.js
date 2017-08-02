import * as types from './types';


export const updateUser = (data) => {
    return {
        type:  types.UPDATE_USER,
        data
    }
}

export const userLogin = (user) => {
    return {
        type: types.USER_LOGIN,
        user
    }
}

export const userLogout = (user) => {
    return {
        type: types.USER_LOGOUT,
        user: undefined
    }
}

export const startLoading = () => { 
    return {
        type: types.START_LOADING
    }
}

export const stopLoading = () => {
    return {
        type: types.STOP_LOADING
    }
}

export const changeTab = (tabName) => {
    return {
        type: types.CHANGE_TAB,
        tabName
    }
}

export const newBet = (bet) => {
    return {
        type: types.NEW_BET,
        bet
    }
}

export const newAllBet = (bet) => {
    return {
        type: types.NEW_ALL_BET,
        bet
    }
}

export const initAllBets = (bets) => {
    return {
        type: types.INIT_ALL_BETS,
        bets
    };
}


export const toggleHotkeys = (hotkeysEnabled) => { 
    return {
        type: types.TOGGLE_HOTKEYS,
        hotkeysEnalbed: !hotkeysEnabled
    };
}

export const disableHotkeys = () => {
    return {
        type: types.DISABLE_HOTKEYS
    };
}

export const startRefreshingUser = () => {
    return {
        type: types.START_REFRESHING_USER
    };
}

export const stopRefreshingUser = () => {
    return {
        type: types.STOP_REFRESHING_USER
    };
}