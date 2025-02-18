import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Card from '../components/Card';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useOutletContext } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useOutletContext: jest.fn(),
}));

describe('Card component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();

    (useOutletContext as jest.Mock).mockReturnValue({
      pokemon: { name: 'pikachu', url: 'url' },
      details: {
        description: 'Electric type',
        types: ['electric'],
        abilities: ['static'],
        stats: ['speed: 90', 'attack: 55'],
      },
      detailsLoading: false,
      results: [
        { name: 'bulbasaur', url: 'url1' },
        { name: 'charmander', url: 'url2' },
      ],
    });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('should display pokemon details when data is available', async () => {
    render(
      <Router>
        <Card />
      </Router>
    );

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('static')).toBeInTheDocument();
    expect(screen.getByText('speed: 90')).toBeInTheDocument();
    expect(screen.getByText('attack: 55')).toBeInTheDocument();
  });

  test('should display list of pokemons and handle click', async () => {
    render(
      <Router>
        <Card />
      </Router>
    );

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('charmander')).toBeInTheDocument();

    fireEvent.click(screen.getByText('bulbasaur'));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        '/class-components/bulbasaur?search=y&page=1&id=bulbasaur&details=1'
      )
    );
  });
});
