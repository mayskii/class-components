import { render, screen } from '@testing-library/react';
import NotFound from '../../../pages/404';
import '@testing-library/jest-dom';

describe('NotFound page', () => {
  test('should render NotFoundPage component', () => {
    render(<NotFound />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});
