import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';
import React from 'react';

describe('ErrorBoundary', () => {
  test('should render children if no error occurs', () => {
    const TestComponent = () => <div>Test component works!</div>;

    render(
      <ErrorBoundary resetError={() => {}}>
        <TestComponent />
      </ErrorBoundary>
    );

    const textElement = screen.getByText('Test component works!');
    expect(textElement).toBeTruthy();
  });

  test('should display error message when error occurs', () => {
    const ErrorTestComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary resetError={() => {}}>
        <ErrorTestComponent />
      </ErrorBoundary>
    );
    const errorText = screen.getByText('Something went wrong!');
    expect(errorText).toBeTruthy();
  });
});
