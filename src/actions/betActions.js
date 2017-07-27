export const UPDATE_WAGER = 'UPDATE_WAGER';
export const UPDATE_MULTIPLIER = 'UPDATE_MULTIPLIER';
export const SET_NEXT_HASH = 'SET_NEXT_HASH';

export function updateWager(newWager){
    return {
        type: UPDATE_WAGER,
        newWager
    };
}

export function updateMultiplier(newMult){
    return {
        type: UPDATE_MULTIPLIER,
        newMult
    };
}

export function setNextHash(hexString){
    return {
        type: SET_NEXT_HASH,
        hexString
    };
}
