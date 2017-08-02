import  { SET_NEXT_HASH } from '../../actions/bet/types';

const initialState = {
    nextHash: undefined
}

const hashReducer = (state = initialState, action ) => {
    switch(action.type) {
        case SET_NEXT_HASH:
         return state;
        default:
         return state;
    }
}

export default hashReducer;

