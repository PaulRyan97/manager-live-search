export type DataResponse = {
    data: EntityType<Employee>[];
    included: EntityType<Employee | Account>[];
    meta: {
        page: { total: number };
    };
    links: LinkObject;
};

export type EntityType<T> = {
    type: string;
    id: string;
    links: LinkObject;
} & T;

export type LinkObject = {
    self: string;
    first?: string;
    last?: string;
};

export type Employee = {
    attributes: {
        identifier: string | null;
        firstName: string;
        lastName: string;
        name: string;
        features: string[];
        avatar: string | null;
        employmentStart: string;
        external: boolean;
        'Last Year Bonus': number;
        'Business Unit': string;
        'Commute Time': number;
        Age: string;
        Department: string;
        Gender: string;
        'Job Level': string;
        'Local Office': string;
        '% of target': number;
        Region: string;
        Salary: number;
        Tenure: string;
    };
    relationships: {
        company: BaseRelationship;
        account: BaseRelationship;
        phones: {
            data: string[];
        };
        Manager: BaseRelationship;
    };
};

export type BaseRelationship = {
    data: { type: string; id: string };
};

export type Account = {
    attributes: {
        email: string;
        locale: string | null;
        timezone: string | null;
        bouncedAt: string | null;
        bouncedReason: string | null;
        localeEffective: string | null;
        timezoneEffective: string | null;
    };
};

export type EmployeeMap = { [id: string]: EmployeeDetails };

export type EmployeeDetails = {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
};

export type AccountsMap = { [id: string]: string };
