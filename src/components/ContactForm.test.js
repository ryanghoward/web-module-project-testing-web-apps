import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
  render(<ContactForm />);
});

test('renders the contact form header', ()=> {
  render(<ContactForm />);
  
  const headerElem = screen.queryByText(/contact form/i);

  expect(headerElem).toBeInTheDocument();
  expect(headerElem).toHaveTextContent(/contact form/i);
  expect(headerElem).toBeTruthy();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />);
  
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, 'abc');

  const errorMessages = await screen.findAllByTestId('error');
  expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />);
  
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);

  await waitFor(() => {
    const errorMessages = screen.getAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
  })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />);
  
  const firstName = screen.getByLabelText(/first name/i);
  userEvent.type(firstName, 'Ryyan');

  const lastName = screen.getByLabelText(/last name/i);
  userEvent.type(lastName, 'Howard');

  const button = screen.getByRole('button');
  userEvent.click(button);

  const errorMessages = await screen.getAllByTestId('error');
  expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  
  const email = screen.getByLabelText(/email/i);
  userEvent.type(email, 'idk');

  const errorMessage = screen.queryByText(/Error: email must be a valid email address/i);
  expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  
  const submitBtn = screen.getByRole('button');
  userEvent.click(submitBtn);

  const errorMessage = await screen.findByText(/lastName is a required field/i);
  expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);
  
  const firstName = screen.getByLabelText(/first name/i);
  const lastName = screen.getByLabelText(/last name/i);
  const email = screen.getByLabelText(/email/i);
  const message = screen.getByLabelText(/message/i);

  userEvent.type(firstName, 'ryyan');
  userEvent.type(lastName, 'howard');
  userEvent.type(email, 'idk@email.com');
  userEvent.type(message, 'message');

  const button = screen.getByRole('button');
  userEvent.click(button);

  await waitFor(() => {
    const firstNameRender = screen.queryByText('ryyan');
    const lastNameRender = screen.queryByText('howard');
    const emailRender = screen.queryByText('idk@email.com');
    const messageRender = screen.queryByText('message');

    expect(firstNameRender).toBeInTheDocument();
    expect(lastNameRender).toBeInTheDocument();
    expect(emailRender).toBeInTheDocument();
    expect(messageRender).toBeInTheDocument();
  });
});

test('renders all fields text when all fields are submitted.', async () => {
});