import * as types from '../../actions/bet/types';
import * as Actions from '../../actions/bet/';


const initialState = {
    nextHash: undefined,
    wager: {
        str: '1',
        num: 1,
        error: undefined
    },
    multiplier: {
        str: '2.00',
        num: 2.00,
        undefined
    },
    hotkeysEnabled: false
}

const betReducer = (state = initialState, action) => {
    switch(action.type) {
        
        case types.UPDATE_MULTIPLIER:
         
         return state;
        
        default:

         return state;
    }
};

export default betReducer;