import { render, screen } from '@testing-library/react';
import NotFound from '../../../../app/not-found/page';
import '@testing-library/jest-dom';

describe('NotFound page', () => {
  test('should render NotFoundPage component', () => {
    render(<NotFound />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});
