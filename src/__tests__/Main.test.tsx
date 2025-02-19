import { render, screen } from '@testing-library/react';
import Main from '../components/Main';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '../context/ThemeProvider';

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
