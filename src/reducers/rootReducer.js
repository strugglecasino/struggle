import { combineReducers } from 'redux';
import chatReducer from './chatReducer';
import betReducer from './betReducer';
import worldReducer from './worldReducer';

const rootReducer = combineReducers({
   worldStore: worldReducer,
   chatStore: chatReducer,
   betStore:  betReducer
});

export default rootReducer;