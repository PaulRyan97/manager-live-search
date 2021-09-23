import { Action } from 'redux';
import _ from 'lodash';

//Reducer to handle reduction based on the action type received
export const createReducer = (defaultState: Object, handlers: Array<Handler>) => {
    return (oldState: Object = defaultState, action: Action) => {
        let handler = handlers.find((handler: Handler) => handler.handlesActionType(action.type));
        if (handler) {
            return handler.reducer(_.cloneDeep(oldState), action);
        }
        return oldState;
    };
};

export class Handler {
    types: Array<string> | string;

    reducer: Function;

    //Create a new handler for an action
    constructor(types: Array<string> | string, reducer: Function) {
        this.types = types;
        this.reducer = reducer;
    }

    handlesActionType(actionType: string) {
        if (Array.isArray(this.types)) {
            return this.types.some((supportedType: string) => actionType === supportedType);
        }
        return this.types === actionType;
    }
}
