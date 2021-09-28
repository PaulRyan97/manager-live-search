/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react';
import React, { useEffect, useMemo, useCallback, useState, useRef, KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import ArrowDownIcon from '../images/arrowDown.svg';
import { borderGrey, highlightedGreen } from '../utils/constants';
import { EmployeeDetails, EmployeeMap } from '../types/employeeDataTypes';
import { connect } from 'react-redux';
import { StoreType } from '../store';
import { Action } from 'redux';
import { fetchEmployeeData } from './actions/searchActions';
import { ThunkDispatch } from 'redux-thunk';
import ManagerMenuItem from './ManagerMenuItem';
import ArrowUpIcon from '../images/arrowUp.svg';

const Input = styled.input({
    border: 'none',
    fontSize: 16,
    width: '100%',
    '&:focus': { outline: 'none' },
});

const InputWrapper = styled.div({
    border: `1px solid ${borderGrey}`,
    borderRadius: 4,
    height: 48,
    padding: '0px 5px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    transition: 'border 100ms',
    '&:focus-within': {
        border: `1px solid ${highlightedGreen}`,
        boxShadow: `0 0 0 1px ${highlightedGreen}CC`,
    },
});

const DropdownMenu = styled.div({
    border: `1px solid ${borderGrey}`,
    borderRadius: 4,
    marginTop: 20,
    maxHeight: 135,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    '& > :not(:last-child)': {
        borderBottom: `1px solid ${borderGrey}`,
    },
    '&::-webkit-scrollbar': {
        width: 0,
        background: 'transparent',
    },
});

type Props = {
    employeeData: EmployeeMap | null;
    fetchError: boolean;
    dispatch: ThunkDispatch<StoreType, {}, Action>;
};

const ManagerDropdownComponentRedux = (props: Props) => {
    const { employeeData, fetchError, dispatch } = props;

    const [searchValue, setSearchValue] = useState('');
    const [showDropdown, setDropdownShown] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [filteredIds, setFilteredIds] = useState<string[]>([]);
    const menuItemsRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        dispatch(fetchEmployeeData());
    }, [dispatch]);

    useEffect(() => {
        const filterManager = (managerId: string): boolean => {
            if (employeeData) {
                const manager = employeeData[managerId];
                let firstName = manager.firstName.toLowerCase();
                let lastName = manager.lastName.toLowerCase();
                let name = manager.name.toLowerCase();
                let search = searchValue.toLowerCase();
                return firstName.includes(search) || lastName.includes(search) || firstName.concat(lastName).includes(search) || name.includes(search);
            }
            return false;
        };

        if (employeeData) {
            const filteredManagers = Object.keys(employeeData).filter(filterManager);
            setFilteredIds(filteredManagers);
            menuItemsRefs.current = [];
            setSelectedItemIndex(filteredManagers.length > 0 ? 0 : -1);
        }
    }, [searchValue, employeeData]);

    const managerList = useMemo(() => {
        if (employeeData) {
            return filteredIds.map((managerId: string, index: number) => {
                const manager: EmployeeDetails = employeeData[managerId];
                return <ManagerMenuItem id={managerId} manager={manager} isHighlighted={selectedItemIndex === index} refCallback={(el) => (menuItemsRefs.current[index] = el)} />;
            });
        }
        return null;
    }, [employeeData, filteredIds, selectedItemIndex]);

    const onMenuKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'ArrowDown' && selectedItemIndex < menuItemsRefs.current.length - 1) {
                setSelectedItemIndex(selectedItemIndex + 1);
                const itemRef = menuItemsRefs.current[selectedItemIndex + 1];
                itemRef && itemRef.scrollIntoView();
            } else if (event.key === 'ArrowUp' && selectedItemIndex > 0) {
                setSelectedItemIndex(selectedItemIndex - 1);
                const itemRef = menuItemsRefs.current[selectedItemIndex - 1];
                itemRef && itemRef.scrollIntoView();
            }
        },
        [menuItemsRefs, selectedItemIndex]
    );

    const onInputConfirm = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && selectedItemIndex !== -1 && employeeData) {
                let managerName = employeeData[filteredIds[selectedItemIndex]].name;
                setSearchValue(managerName);
                event.currentTarget.blur();
            }
        },
        [selectedItemIndex, employeeData, filteredIds]
    );

    return (
        <div style={{ width: 300 }} onKeyDown={onMenuKeyDown}>
            <span>{'Using Redux'}</span>
            <InputWrapper>
                <Input
                    value={searchValue}
                    onKeyDown={onInputConfirm}
                    disabled={fetchError}
                    onFocus={() => {
                        setDropdownShown(true);
                        if (managerList && managerList.length > 0) {
                            setSelectedItemIndex(0);
                        }
                    }}
                    onBlur={() => {
                        setDropdownShown(false);
                        setSelectedItemIndex(-1);
                    }}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder={'Choose Manager'}
                />
                <img src={showDropdown ? ArrowUpIcon : ArrowDownIcon} />
            </InputWrapper>
            {showDropdown ? (
                <DropdownMenu data-testid={'dropdown-menu'}>
                    {managerList && managerList.length > 0 ? managerList : <div css={{ padding: 10 }}>{'No results found'}</div>}
                </DropdownMenu>
            ) : null}
            {fetchError ? <div css={{ padding: 10, color: 'red' }}>{'Error fetching employee data'}</div> : null}
        </div>
    );
};

const mapStateToProps = (state: StoreType) => {
    return {
        employeeData: state.searchState.employeeData,
        fetchError: state.searchState.fetchError,
    };
};

export default connect(mapStateToProps)(ManagerDropdownComponentRedux);
