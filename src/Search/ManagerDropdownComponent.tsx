import React, { useEffect, useMemo, useCallback, useState, useRef, KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import ArrowDownIcon from '../images/arrowDown.svg';
import { API_ENDPOINT, borderGrey, highlightedGreen } from '../utils/constants';
import axios, { AxiosResponse } from 'axios';
import { Account, AccountsMap, DataResponse, Employee, EmployeeDetails, EmployeeMap, EntityType } from '../types/employeeDataTypes';

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
    '& > :not(:last-child)': {
        borderBottom: `1px solid ${borderGrey}`,
    },
    '&::-webkit-scrollbar': {
        width: 0,
        background: 'transparent',
    },
});

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

const ManagerDropdownComponent = () => {
    const [searchValue, setSearchValue] = useState('');
    const [showDropdown, setDropdownShown] = useState(false);
    const [managerData, setManagerData] = useState<EmployeeMap | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [filteredIds, setFilteredIds] = useState<string[]>([]);
    const menuItemsRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        axios.get(API_ENDPOINT).then((result: AxiosResponse<DataResponse>) => {
            let responseData: DataResponse = result.data;
            if (responseData) {
                let accountsMap: AccountsMap = {};
                responseData.included.forEach((entity: EntityType<Employee | Account>) => {
                    if (entity.type === 'accounts') {
                        let account = entity as any as EntityType<Account>;
                        accountsMap[entity.id] = account.attributes.email;
                    }
                });
                let employeeMap: EmployeeMap = {};
                responseData.data.forEach((employee: EntityType<Employee>) => {
                    employeeMap[employee.id] = {
                        firstName: employee.attributes.firstName,
                        lastName: employee.attributes.lastName,
                        name: employee.attributes.name,
                        email: accountsMap[employee.relationships.account.data.id],
                    };
                });

                setManagerData(employeeMap);
                setFilteredIds(Object.keys(employeeMap));
            }
        });
    }, []);

    useEffect(() => {
        const filterManager = (managerId: string): boolean => {
            if (managerData) {
                const manager = managerData[managerId];
                let firstName = manager.firstName.toLowerCase();
                let lastName = manager.lastName.toLowerCase();
                let search = searchValue.toLowerCase();
                return firstName.includes(search) || lastName.includes(search) || firstName.concat(lastName).includes(search);
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
                const initials = manager.firstName.substring(0, 1).concat(manager.lastName.substring(0, 1));
                return (
                    <div
                        id={managerId}
                        key={managerId}
                        ref={(el) => (menuItemsRefs.current[index] = el)}
                        style={{ display: 'flex', margin: '0px 10px', padding: '10px 0px', backgroundColor: selectedItemIndex === index ? 'gray' : 'transparent' }}>
                        <UserAvatar>{initials}</UserAvatar>
                        <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 5px', justifyContent: 'space-evenly' }}>
                            <span>{manager.name}</span>
                            <span style={{ fontSize: 12, color: borderGrey }}>{manager.email}</span>
                        </div>
                    </div>
                );
            });
        }
        return null;
    }, [managerData, filteredIds, selectedItemIndex]);

    const onKeyDown = useCallback(
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

    return (
        <div style={{ width: 300 }} onKeyDown={onKeyDown}>
            <InputWrapper>
                <Input
                    value={searchValue}
                    onFocus={() => {
                        setDropdownShown(true);
                        if (managerList && managerList.length > 0) {
                            setSelectedItemIndex(0);
                        }
                    }}
                    onBlur={() => {
                        setDropdownShown(false);
                    }}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder={'Choose Manager'}
                />
                <img src={ArrowDownIcon} />
            </InputWrapper>
            {showDropdown ? <DropdownMenu>{managerList}</DropdownMenu> : null}
        </div>
    );
};

export default ManagerDropdownComponent;
