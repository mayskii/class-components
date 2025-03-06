import { render, screen } from '@testing-library/react';
import ClassComponents from '../../../../pages/class-components';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../../../context/ThemeProvider';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { store } from '../../../store';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ClassComponents', () => {
  test('renders Main component', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      query: {},
      pathname: '/',
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
