import { render, screen } from '@testing-library/react';
import Main from '../components/Main';
import { BrowserRouter as Router } from 'react-router-dom';
// import Pagination from '../components/Pagination';
import { Provider } from 'react-redux';
import { store } from '../store';

test('renders the component', async () => {
  render(
    <Provider store={store}>
      <Router>
        <Main />
      </Router>
    </Provider>
  );

  const loadingText = await screen.findByText('Loading...');
  expect(loadingText).toBeTruthy();
});
