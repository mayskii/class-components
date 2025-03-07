import { render, screen } from '@testing-library/react';
import HomePage from '../../../app/page';
import '@testing-library/jest-dom';

describe('HomePage', () => {
  it('renders correctly', () => {
    render(<HomePage />);

    expect(screen.getByText('Welcome to the Pokémon App!')).toBeInTheDocument();

    const link = screen.getByText('Go!!!');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/class-components');
  });
});
