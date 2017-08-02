import { UPDATE_MULTIPLIER } from '../../actions/bet/types';

const initialState = {
    str: '2.00',
    num: 2.00,
    error: undefined
};

const multiplierReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_MULTIPLIER:
         return state;
        default:
         return state;
    }
}

export default multiplierReducer;