import { reducer } from './reducers/index';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const reducers = combineReducers({
  reducer: reducer,
});

export const store = createStore(reducers, compose(applyMiddleware(thunk)));
