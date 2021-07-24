import { combineReducers } from 'redux';
import user from './user_reducer';
// 여러 도메인? 별로 리듀서를 만들어서 여기서 합쳐준다. combine

const rootReducer = combineReducers({
    user
})

export default rootReducer;