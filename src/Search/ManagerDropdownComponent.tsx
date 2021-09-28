/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react';
import React, { useEffect, useMemo, useCallback, useState, useRef, KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import ArrowDownIcon from '../images/arrowDown.svg';
import ArrowUpIcon from '../images/arrowUp.svg';
import { API_ENDPOINT, borderGrey, highlightedGreen } from '../utils/constants';
import axios, { AxiosResponse } from 'axios';
import { DataResponse, EmployeeDetails, EmployeeMap } from '../types/employeeDataTypes';
import { mapEmployeeData } from './helpers';
import ManagerMenuItem from './ManagerMenuItem';

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

const ManagerDropdownComponent = () => {
    const [searchValue, setSearchValue] = useState('');
    const [showDropdown, setDropdownShown] = useState(false);
    const [managerData, setManagerData] = useState<EmployeeMap | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [filteredIds, setFilteredIds] = useState<string[]>([]);
    const [fetchError, setFetchError] = useState(false);
    const menuItemsRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        axios
            .get(API_ENDPOINT)
            .then((result: AxiosResponse<DataResponse>) => {
                let responseData: DataResponse = result.data;
                if (responseData) {
                    const employeeMap = mapEmployeeData(responseData);

                    setManagerData(employeeMap);
                    setFilteredIds(Object.keys(employeeMap));
                    setFetchError(false);
                }
            })
            .catch(() => {
                setFetchError(true);
            });
    }, []);

    useEffect(() => {
        const filterManager = (managerId: string): boolean => {
            if (managerData) {
                const manager = managerData[managerId];
                let firstName = manager.firstName.toLowerCase();
                let lastName = manager.lastName.toLowerCase();
                let name = manager.name.toLowerCase();
                let search = searchValue.toLowerCase();
                return firstName.includes(search) || lastName.includes(search) || firstName.concat(lastName).includes(search) || name.includes(search);
            }
            return false;
        };

        if (managerData) {
            const filteredManagers = Object.keys(managerData).filter(filterManager);
            setFilteredIds(filteredManagers);
            menuItemsRefs.current = [];
            setSelectedItemIndex(filteredManagers.length > 0 ? 0 : -1);
        }
    }, [searchValue, managerData]);

    const managerList = useMemo(() => {
        if (managerData) {
            return filteredIds.map((managerId: string, index: number) => {
                const manager: EmployeeDetails = managerData[managerId];
                return (
                    <ManagerMenuItem
                        id={managerId}
                        manager={manager}
                        data-testid={'manager-' + managerId}
                        isHighlighted={selectedItemIndex === index}
                        refCallback={(el) => (menuItemsRefs.current[index] = el)}
                    />
                );
            });
        }
        return null;
    }, [managerData, filteredIds, selectedItemIndex]);

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
            if (event.key === 'Enter' && selectedItemIndex !== -1 && managerData) {
                let managerName = managerData[filteredIds[selectedItemIndex]].name;
                setSearchValue(managerName);
                event.currentTarget.blur();
            }
        },
        [selectedItemIndex, managerData, filteredIds]
    );

    return (
        <div style={{ width: 300 }} onKeyDown={onMenuKeyDown}>
            <span>{'Local State'}</span>
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
            {showDropdown ? <DropdownMenu data-testid={'dropdown-menu'}>{managerList}</DropdownMenu> : null}
            {fetchError ? <div css={{ padding: 10, color: 'red' }}>{'Error fetching employee data'}</div> : null}
        </div>
    );
};

export default ManagerDropdownComponent;
