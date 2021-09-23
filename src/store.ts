import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import appReducer, { AppStateType } from './app/appReducer';

const reducers = combineReducers({
    appState: appReducer,
});

const logger = createLogger({});

export type StoreType = {
    appState: AppStateType;
};

const store = createStore(reducers, applyMiddleware(ReduxThunk, logger));

export default store;
