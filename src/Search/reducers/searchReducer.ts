import { createReducer } from '../../utils/createReducer';
import { ClearDataFetchErrorAction, SEARCH_ACTION_TYPES, SetDataFetchErrorAction, SetEmployeeDataAction } from '../actions/searchActions';
import { Handler } from '../../utils/createReducer';
import { EmployeeMap } from '../../types/employeeDataTypes';

export type SearchStateType = {
    employeeData: EmployeeMap | null;
    fetchError: boolean;
};

const searchDefaultState: SearchStateType = {
    employeeData: null,
    fetchError: false,
};

export default createReducer(searchDefaultState, [
    new Handler(SEARCH_ACTION_TYPES.SET_EMPLOYEE_DATA, (state: SearchStateType, action: SetEmployeeDataAction) => {
        state.employeeData = action.data;
        return state;
    }),
    new Handler(SEARCH_ACTION_TYPES.SET_DATA_FETCH_ERROR, (state: SearchStateType, action: SetDataFetchErrorAction) => {
        state.fetchError = true;
        return state;
    }),
    new Handler(SEARCH_ACTION_TYPES.CLEAR_DATA_FETCH_ERROR, (state: SearchStateType, action: ClearDataFetchErrorAction) => {
        state.fetchError = false;
        return state;
    }),
]);
