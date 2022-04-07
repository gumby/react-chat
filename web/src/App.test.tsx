import { render, screen } from '@testing-library/react';
import React from 'react';
import App2 from './App2';

test('renders learn react link', () => {
  render(<App2 />);
  const linkElement = screen.getByText(/Login To Chat!/i);
  expect(linkElement).toBeInTheDocument();
});
