import { render, screen } from '@testing-library/react';
import Main from '../components/Main';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Main Component', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <Main />
      </Router>
    );

    const errorButton = screen.getByRole('button', { name: /Throw Error/i });
    expect(errorButton).toBeTruthy();
  });

  test('has an error button', () => {
    render(
      <Router>
        <Main />
      </Router>
    );

    const errorButton = screen.getByRole('button', { name: /Throw Error/i });
    expect(errorButton).toBeTruthy();
  });
});
