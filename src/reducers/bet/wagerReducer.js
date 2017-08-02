import { UPDATE_WAGER } from '../../actions/bet/types';
const initialState = {
        str: '1',
        num: 1,
        error: undefined
};

const wagerReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_WAGER:
         return state;
        default:
         return state;
    }
};

export default wagerReducer;