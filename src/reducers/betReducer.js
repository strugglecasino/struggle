const initialState = {
    nextHash: undefined,
    wager: {
        str: '1',
        num: 1
    },
    multiplier: {
        str: '2.00',
        num: 2.00
    }
};

export default function betReducer(state = initialState, action) {
    switch(action.type) {
        case 'SET_NEXT_HASH':
         return action.hexString;
        case 'UPDATE_WAGER':
         return action.newWager;
        case 'UPDATE_MULTIPLIER':
         return action.newMult;
        default:
         return state
    }
};