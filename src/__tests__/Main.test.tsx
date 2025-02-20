import { fireEvent, render, screen } from '@testing-library/react';
import Main from '../components/Main';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../context/ThemeProvider';
import ErrorBoundary from '../components/ErrorBoundary';

test('renders the component', async () => {
  render(
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Main />
        </Router>
      </ThemeProvider>
    </Provider>
  );

  const loadingText = await screen.findByText('Loading...');
  expect(loadingText).toBeTruthy();
});

test('renders the error button and triggers an error', () => {
  const mockResetError = jest.fn();

  render(
    <Provider store={store}>
      <ErrorBoundary resetError={mockResetError}>
        <ThemeProvider>
          <Router>
            <Main />
          </Router>
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );

  const errorButton = screen.getByRole('button', { name: /throw error/i });
  expect(errorButton).toBeInTheDocument();

  fireEvent.click(errorButton);

  const errorMessage = screen.getByText(/Something went wrong!/i);
  expect(errorMessage).toBeInTheDocument();

  const errorDetails = screen.getByText(/Error details/i);
  expect(errorDetails).toBeInTheDocument();

  const retryButton = screen.getByRole('button', { name: /try again!/i });
  expect(retryButton).toBeInTheDocument();

  fireEvent.click(retryButton);

  expect(mockResetError).toHaveBeenCalledTimes(1);
});

test('theme toggles between light and dark on button click', () => {
  const { container } = render(
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Main />
        </Router>
      </ThemeProvider>
    </Provider>
  );

  const themeToggleButton = screen.getByRole('button', { name: /light/i });

  let appContainer = container.querySelector('.app-container');
  expect(appContainer).toHaveClass('app-container dark');

  fireEvent.click(themeToggleButton);

  appContainer = container.querySelector('.app-container');
  expect(appContainer).toHaveClass('app-container light');

  fireEvent.click(themeToggleButton);

  appContainer = container.querySelector('.app-container');
  expect(appContainer).toHaveClass('app-container dark');
});
