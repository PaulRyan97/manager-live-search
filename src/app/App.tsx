import React from 'react';
import ManagerDropdownComponentRedux from '../Search/ManagerDropdownComponentRedux';
import ManagerDropdownComponent from '../Search/ManagerDropdownComponent';
import styled from '@emotion/styled';
import { backgroundColor } from '../utils/constants';

const SearchWrapper = styled.div({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: 'calc(100% - 40px)',
    height: 'calc(100% - 40px)',
    padding: 20,
    backgroundColor: backgroundColor,
});

const App = () => {
    return (
        <SearchWrapper>
            <ManagerDropdownComponent />
            <ManagerDropdownComponentRedux />
        </SearchWrapper>
    );
};

export default App;
