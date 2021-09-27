/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react';
import React from 'react';
import styled from '@emotion/styled';
import { highlightedGreen, highlightGrey, textGrey } from '../utils/constants';
import { EmployeeDetails } from '../types/employeeDataTypes';

const UserAvatar = styled.div({
    height: 36,
    width: 36,
    margin: 5,
    border: '1px solid transparent',
    borderRadius: 4,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: highlightedGreen,
});

type Props = {
    id: string;
    manager: EmployeeDetails;
    isHighlighted: boolean;
    refCallback: (el: HTMLDivElement) => void;
};

const ManagerMenuItem = (props: Props) => {
    const { id, manager, isHighlighted, refCallback } = props;

    const initials = manager.firstName.substring(0, 1).concat(manager.lastName.substring(0, 1));

    return (
        <div id={id} key={id} ref={refCallback} css={{ display: 'flex', margin: '0px 10px', padding: '10px 0px', backgroundColor: isHighlighted ? highlightGrey : 'transparent' }}>
            <UserAvatar>{initials}</UserAvatar>
            <div css={{ display: 'flex', flexDirection: 'column', margin: '0px 5px', justifyContent: 'space-evenly' }}>
                <span>{manager.name}</span>
                <span css={{ fontSize: 12, color: textGrey }}>{manager.email}</span>
            </div>
        </div>
    );
};

export default ManagerMenuItem;
