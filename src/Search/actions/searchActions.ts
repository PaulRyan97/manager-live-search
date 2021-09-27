import { Action } from 'redux';
import { DataResponse, EmployeeMap } from '../../types/employeeDataTypes';
import { StoreType } from '../../store';
import { ThunkAction } from 'redux-thunk';
import axios, { AxiosResponse } from 'axios';
import { API_ENDPOINT } from '../../utils/constants';
import { mapEmployeeData } from '../helpers';

export const SEARCH_ACTION_TYPES = Object.freeze({
    FETCH_EMPLOYEE_DATA: 'FETCH_EMPLOYEE_DATA',
    SET_EMPLOYEE_DATA: 'SET_EMPLOYEE_DATA',
});

export const fetchEmployeeData = (): ThunkAction<void, StoreType, {}, Action> => {
    return (dispatch) => {
        axios.get(API_ENDPOINT).then((result: AxiosResponse<DataResponse>) => {
            let responseData: DataResponse = result.data;
            if (responseData) {
                const employeeMap = mapEmployeeData(responseData);
                dispatch(setEmployeeData(employeeMap));
            }
        });
    };
};

export type SetEmployeeDataAction = Action<typeof SEARCH_ACTION_TYPES.SET_EMPLOYEE_DATA> & {
    data: EmployeeMap;
};
export const setEmployeeData = (data: EmployeeMap) => {
    return { type: SEARCH_ACTION_TYPES.SET_EMPLOYEE_DATA, data };
};
