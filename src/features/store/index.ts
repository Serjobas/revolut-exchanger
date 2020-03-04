import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { pocketsReducer } from 'features/pockets/reducer';

const reducers = combineReducers({
  pockets: pocketsReducer,
});

export type State = ReturnType<typeof reducers>;

export default createStore(reducers, applyMiddleware(thunk));
