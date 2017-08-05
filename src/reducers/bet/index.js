import * as types from '../../actions/bet/types';
import * as Actions from '../../actions/bet/';
import _ from 'lodash';


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
    }
}

const betReducer = (state = initialState, action) => {
    switch(action.type) {


        case types.SET_NEXT_HASH:
         
         return Actions.setNextHash;
        
        case types.UPDATE_MULTIPLIER:
         
         return Object.assign({}, state, {
             str: state.multiplier.str
         })

        case types.UPDATE_WAGER:
         return Object.assign({}, state, {
             str: state.wager.str
         })
         
        default:

         return state;
    }
};

export default betReducer;