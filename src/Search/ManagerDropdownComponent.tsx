import React, { useState } from 'react';
import styled from '@emotion/styled';
import ArrowDownIcon from '../images/arrowDown.svg';
import { borderGrey, highlightedGreen } from '../utils/constants';

const Input = styled.input({
    border: 'none',
    fontSize: 16,
    '&:focus': { outline: 'none' },
});

const InputWrapper = styled.div({
    border: `1px solid ${borderGrey}`,
    borderRadius: 4,
    height: 48,
    padding: '0px 5px',
    display: 'flex',
    alignItems: 'center',
    width: 'max-content',
    transition: 'border 100ms',
    '&:focus-within': {
        border: `1px solid ${highlightedGreen}`,
        boxShadow: `0 0 0 1px ${highlightedGreen}CC`,
    },
});

const ManagerDropdownComponent = () => {
    const [searchValue, setSearchValue] = useState('');
    return (
        <InputWrapper>
            <Input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder={'Choose Manager'} />
            <img src={ArrowDownIcon} />
        </InputWrapper>
    );
};

export default ManagerDropdownComponent;
