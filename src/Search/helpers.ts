import { Account, AccountsMap, DataResponse, Employee, EmployeeMap, EntityType } from '../types/employeeDataTypes';

export const mapEmployeeData = (response: DataResponse): EmployeeMap => {
    let accountsMap: AccountsMap = {};
    response.included.forEach((entity: EntityType<Employee | Account>) => {
        if (entity.type === 'accounts') {
            let account = entity as any as EntityType<Account>;
            accountsMap[entity.id] = account.attributes.email;
        }
    });
    let employeeMap: EmployeeMap = {};
    response.data.forEach((employee: EntityType<Employee>) => {
        employeeMap[employee.id] = {
            firstName: employee.attributes.firstName,
            lastName: employee.attributes.lastName,
            name: employee.attributes.name,
            email: accountsMap[employee.relationships.account.data.id],
        };
    });

    return employeeMap;
};
