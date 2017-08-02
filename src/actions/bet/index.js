import * as types from './types';


export const onWagerChange = (e) => ({
    type: types.UPDATE_WAGER,
    str: e.target.value
});

export const onMultiplierChange = (e) => ({
    type: types.UPDATE_MULTIPLIER,
    str: e.target.value
});

export const setNextHash = (hexString) => ({
     
        type: types.SET_NEXT_HASH,
        hexString
});

export function minWager(min){
    return {
        type: types.UPDATE_WAGER,
        min
    };
}

export const maxWager = (max) => {
    return {
        type: types.UPDATE_WAGER,
        max
    }
}

export const halveWager = (newWager) => {
    return {
        type: types.UPDATE_WAGER,
        newWager
    };
}

export const doubleWager = (n) => {
    return {
        type: types.UPDATE_WAGER,
        n
    };
}


export const halveMultiplier = (newMult) => {
    return {
        type: types.UPDATE_MULTIPLIER,
        newMult
    };
}

export const doubleMultiplier = (n) => {
    return {
        type: types.UPDATE_MULTIPLIER,
        n
    };
}

export const maxMultiplier = (max) => {
    return {
        type: types.UPDATE_MULTIPLIER,
        max
    };
}


export const minMultiplier = (min) => {
    return {
        type: types.MIN_MULTIPLIER,
        min
    }
}

export const updateWager = (newWager) => ({
    type: types.UPDATE_WAGER,
    newWager
});

export const updateMultiplier = (newMult) => {
    return {
        type: types.UPDATE_MULTIPLIER,
        newMult
    }
}