import React from 'react';
import { render, screen } from '@testing-library/react';
import CardList from '../components/CardList';
import '@testing-library/jest-dom';

const mockOnPokemonClick = jest.fn();
const mockData = [
  { name: 'Pokemon 1', url: 'https://pokeapi.co/api/v2/pokemon/1' },
  { name: 'Pokemon 2', url: 'https://pokeapi.co/api/v2/pokemon/2' },
];

describe('CardList component', () => {
  test('displays "No result found" when there are no cards', () => {
    render(<CardList results={[]} onPokemonClick={jest.fn()} />);
    expect(screen.getByText(/No result found/i)).toBeInTheDocument();
  });

  test('renders the correct number of rows in the table', () => {
    render(<CardList results={mockData} onPokemonClick={mockOnPokemonClick} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);
  });
});
