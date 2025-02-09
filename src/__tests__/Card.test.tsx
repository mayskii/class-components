import { fireEvent, render, screen } from '@testing-library/react';
import Card from '../components/Card';
import { BrowserRouter as Router, useOutletContext } from 'react-router-dom';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: jest.fn(),
}));

const mockPokemon = {
  name: 'Pikachu',
  description: {
    types: ['Electric'],
    abilities: ['Static'],
    stats: ['Speed: 90'],
  },
};

const mockResults = [
  {
    name: 'Charmander',
    url: 'https://pokeapi.co/api/v2/pokemon/4/',
  },
  {
    name: 'Bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  },
];

describe('Card component', () => {
  test('renders loading state when pokemon is not loaded', () => {
    (useOutletContext as jest.Mock).mockReturnValue({
      pokemon: null,
      results: mockResults,
      detailsLoading: true,
    });
    render(
      <Router>
        <Card />
      </Router>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders pokemon name after loading', () => {
    (useOutletContext as jest.Mock).mockReturnValue({
      pokemon: mockPokemon,
      results: mockResults,
      detailsLoading: false,
    });

    render(
      <Router>
        <Card />
      </Router>
    );

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  test('shows loading indicator when pokemon is loading', () => {
    (useOutletContext as jest.Mock).mockReturnValue({
      pokemon: null,
      results: [],
      detailsLoading: true,
    });

    render(
      <Router>
        <Card />
      </Router>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders results list and allows clicking', () => {
    (useOutletContext as jest.Mock).mockReturnValue({
      pokemon: mockPokemon,
      results: mockResults,
      detailsLoading: false,
    });

    render(
      <Router>
        <Card />
      </Router>
    );

    mockResults.forEach((pokemon) => {
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Charmander'));
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });
});
