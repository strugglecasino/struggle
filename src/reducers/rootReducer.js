import { combineReducers } from 'redux';
import chat from './chat/';
import world from './world/';
import bet from './bet/';

const rootReducer = combineReducers({
   chat,
   world,
   bet
});

export default rootReducer;