import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import ArrowDownIcon from '../images/arrowDown.svg';
import { API_ENDPOINT, borderGrey, highlightedGreen } from '../utils/constants';
import axios, { AxiosResponse } from 'axios';
import { Account, AccountsMap, DataResponse, Employee, EmployeeDetails, EmployeeMap, EntityType } from '../types/employeeDataTypes';

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
    const [managerData, setManagerData] = useState<EmployeeMap | null>(null);

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
            }
        });
    }, []);

    const managerList = useMemo(() => {
        const filterManager = (manager: EmployeeDetails): boolean => {
            let firstName = manager.firstName.toLowerCase();
            let lastName = manager.lastName.toLowerCase();
            let search = searchValue.toLowerCase();
            return firstName.includes(search) || lastName.includes(search) || firstName.concat(lastName).includes(search);
        };

        if (managerData) {
            return Object.values(managerData)
                .filter(filterManager)
                .map((manager: EmployeeDetails) => <span>{manager.name}</span>);
        }
        return null;
    }, [managerData, searchValue]);

    return (
        <>
            <InputWrapper>
                <Input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder={'Choose Manager'} />
                <img src={ArrowDownIcon} />
            </InputWrapper>
            <div style={{ display: 'flex', flexDirection: 'column' }}>{managerList}</div>
        </>
    );
};

export default ManagerDropdownComponent;
