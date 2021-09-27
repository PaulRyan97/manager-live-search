import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import searchReducer, { SearchStateType } from './Search/reducers/searchReducer';

const reducers = combineReducers({
    searchState: searchReducer,
});

const logger = createLogger({});

export type StoreType = {
    searchState: SearchStateType;
};

const store = createStore(reducers, applyMiddleware(ReduxThunk, logger));

export default store;
