import { render, screen } from '@testing-library/react';
import ClassComponents from '../../../../app/class-components/page';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../../../context/ThemeProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '../../../store';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('ClassComponents', () => {
  test('renders Main component', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      query: {},
      pathname: '/',
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <ClassComponents />
        </ThemeProvider>
      </Provider>
    );

    expect(
      screen.getByPlaceholderText(/enter search term/i)
    ).toBeInTheDocument();
  });
});
