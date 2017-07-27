export const UPDATE_USER = 'UPDATE_USER';
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const CHANGE_TAB = 'CHANGE_TAB';
export const NEW_BET = 'NEW_BET';
export const NEW_ALL_BET = 'NEW_ALL_BETS';
export const INIT_ALL_BETS = 'INIT_ALL_BETS';
export const TOGGLE_HOTKEYS = 'TOGGLE_HOTKEYS';
export const DISABLE_HOTKEYS = 'DISABLE_HOTKEYS';
export const START_REFRESHING_USER = 'START_REFRESHING_USER';
export const STOP_REFRESHING_USER = 'STOP_REFRESHING_USER';

export function updateUser(data){
    return {
        type:  UPDATE_USER,
        data
    }
}

export function userLogin(user){
    return {
        type: USER_LOGIN,
        user
    }
}

export function userLogout(user){
    return {
        type: USER_LOGOUT,
        user
    }
}

export function startLoading(){
    return {
        type: START_LOADING
    }
}

export function stopLoading(){
    return {
        type: STOP_LOADING
    }
}

export function changeTab(tabName){
    return {
        type: CHANGE_TAB,
        tabName
    }
}

export function newBet(bet){
    return {
        type: NEW_BET,
        bet
    }
}

export function newAllBet(bet){
    return {
        type: NEW_ALL_BET,
        bet
    }
}

export function initAllBets(bets){
    return {
        type: INIT_ALL_BETS,
        bets
    };
}

export function toggleHotkeys(hotkeysEnabled){
    return {
        type: TOGGLE_HOTKEYS,
        hotkeysEnabled: !hotkeysEnabled
    };
}

export function disableHotkeys(hotkeysEnabled){
    return {
        type: DISABLE_HOTKEYS,
        hotkeysEnabled: !hotkeysEnabled
    };
}

export function startRefreshingUser(){
    return {
        type: START_REFRESHING_USER
    };
}

export function stopRefreshingUser(){
    return {
        type: STOP_REFRESHING_USER
    };
}