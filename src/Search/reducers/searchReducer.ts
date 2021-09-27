import { createReducer } from '../../utils/createReducer';
import { SEARCH_ACTION_TYPES, SetEmployeeDataAction } from '../actions/searchActions';
import { Handler } from '../../utils/createReducer';
import { EmployeeMap } from '../../types/employeeDataTypes';

export type SearchStateType = {
    employeeData: EmployeeMap | null;
};

const searchDefaultState: SearchStateType = {
    employeeData: null,
};

export default createReducer(searchDefaultState, [
    new Handler(SEARCH_ACTION_TYPES.SET_EMPLOYEE_DATA, (state: SearchStateType, action: SetEmployeeDataAction) => {
        state.employeeData = action.data;
        return state;
    }),
]);
