import React from 'react';
import { useDispatch } from 'react-redux';
import ManagerDropdownComponent from '../Search/ManagerDropdownComponent';

const App = () => {
    const dispatch = useDispatch();

    return (
        <div>
            <ManagerDropdownComponent />
        </div>
    );
};

export default App;
