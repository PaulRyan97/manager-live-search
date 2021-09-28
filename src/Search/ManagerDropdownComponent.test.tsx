import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManagerDropdownComponent from './ManagerDropdownComponent';
import testResponseData from '../__tests__/testResponse.json';

const server = setupServer(
    rest.get('https://gist.githubusercontent.com/*', (req, res, ctx) => {
        return res(ctx.json(testResponseData));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Dropdown filter...', () => {
    test('loads without error', async () => {
        render(<ManagerDropdownComponent />);

        const inputField = screen.getByPlaceholderText('Choose Manager');
        expect(inputField).toBeTruthy();

        expect(screen.queryByText('Error fetching employee data')).toBeNull();
    });

    test('displays dropdown when input is focused', async () => {
        render(<ManagerDropdownComponent />);

        const inputField = screen.getByPlaceholderText('Choose Manager');
        expect(inputField).toBeTruthy();

        fireEvent.focus(inputField);

        await waitFor(() => expect(screen.getByTestId('dropdown-menu')).toBeTruthy());
        await waitFor(() => expect(screen.getByTestId('dropdown-menu').childElementCount).toEqual(3));
    });

    test('filters managers correctly', async () => {
        render(<ManagerDropdownComponent />);

        const inputField = screen.getByPlaceholderText('Choose Manager');
        fireEvent.focus(inputField);

        await waitFor(() => expect(screen.getByTestId('dropdown-menu')).toBeTruthy());
        await waitFor(() => expect(screen.getByTestId('dropdown-menu').childElementCount).toEqual(3));

        fireEvent.change(inputField, { target: { value: 'doe' } });
        await waitFor(() => expect(screen.getByTestId('dropdown-menu').childElementCount).toEqual(2));
        expect(screen.getByText('John Doe')).toBeTruthy();
        expect(screen.getByText('Jane Doe')).toBeTruthy();

        fireEvent.change(inputField, { target: { value: 'nobody' } });
        await waitFor(() => expect(screen.getByTestId('dropdown-menu').childElementCount).toEqual(0));
    });

    test('displays error when endpoint is unreachable', async () => {
        server.use(
            rest.get('https://gist.githubusercontent.com/*', (req, res, ctx) => {
                return res(ctx.status(500));
            })
        );
        render(<ManagerDropdownComponent />);

        const inputField = screen.getByPlaceholderText('Choose Manager');

        await waitFor(() => expect(inputField).toBeDisabled());
        await waitFor(() => expect(screen.getByText('Error fetching employee data')).toBeTruthy());
    });
});
