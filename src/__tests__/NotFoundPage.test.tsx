import React from 'react';
import { render } from '@testing-library/react';
import NotFoundPage from '../../components/NotFoundPage';

describe('NotFoundPage', () => {
  test('renders correctly with 404 message', () => {
    const { getByText } = render(<NotFoundPage />);

    expect(getByText('404')).toBeTruthy();

    expect(getByText('Page Not Found')).toBeTruthy();
  });
});
