import { render, screen } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

test('renders NotFoundPage for unknown route', () => {
  render(<App />);

  const notFoundText = screen.getByText(/Page Not Found/i);
  expect(notFoundText).toBeInTheDocument();
});
