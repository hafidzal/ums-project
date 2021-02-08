import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Form from './components/form';

test('users displayed', () => {
    const { getByTestId } = render(<App/>);
    const user = getByTestId('users');
    expect(user.length).toBe(1);
});

test('add user works', () => {
    const { getByTestId } = render(<Form />);
    const inputFirstName = getByTestId('first-name-input');
    const submitButton = getByTestId('submit-button');

    inputFirstName.value = "John";
    fireEvent.click(submitButton);
    expect(user.length).toBe(2);
});

test('search button works', () => {
    const { getByTestId, queryByTestId } = render(<App/>);
    const searchButton = getByTestId('search-button');

    expect(queryByTestId('search-users').toBeNull());
    fireEvent.click(searchButton);
    expect(queryByTestId('search-users-result').toBeInTheDocument());
});

test('modal works', () => {
    const { getByTestId, queryByTestId } = render(<App/>);
    const updateButton = getByTestId('update-button');

    fireEvent.click(updateButton);
    expect(queryByTestId('modal').toBeInTheDocument());
});

test('delete button works', () => {
    const { getByTestId } = render(<App/>);
    const deleteButton = getByTestId('delete-button');
    const user = getByTestId('users');

    expect(user.length).toBe(1);
    fireEvent.click(deleteButton);
    expect(user.length).toBe(0);

});

