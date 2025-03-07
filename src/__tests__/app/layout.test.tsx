import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../../../app/layout';
import '@testing-library/jest-dom';

describe('RootLayout', () => {
  it('renders without crashing', () => {
    render(
      <RootLayout>
        <p data-testid="child-content">Test Content</p>
      </RootLayout>
    );

    expect(screen.getByTestId('child-content')).toHaveTextContent(
      'Test Content'
    );
  });
});
