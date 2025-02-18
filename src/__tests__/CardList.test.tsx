import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CardList from '../components/CardList';
import '@testing-library/jest-dom';
import { Pokemon } from '../servises/pokemonApi';

const mockData = [
  { name: 'bulbasaur', url: 'url1' },
  { name: 'ivysaur', url: 'url2' },
];

const mockOnPokemonClick = jest.fn();
const mockOnSelectItem = jest.fn();
const mockOnUnselectItem = jest.fn();

const mockSelectedItems: Pokemon[] = [];

describe('CardList', () => {
  test('renders correctly with empty results', () => {
    render(
      <CardList
        results={[]}
        onPokemonClick={mockOnPokemonClick}
        onSelectItem={mockOnSelectItem}
        onUnselectItem={mockOnUnselectItem}
        selectedItems={mockSelectedItems}
      />
    );
  });

  test('renders correctly with mock data', () => {
    render(
      <CardList
        results={mockData}
        onPokemonClick={mockOnPokemonClick}
        onSelectItem={mockOnSelectItem}
        onUnselectItem={mockOnUnselectItem}
        selectedItems={mockSelectedItems}
      />
    );
  });

  test('should render a list of cards when data is provided', () => {
    render(
      <CardList
        results={mockData}
        onPokemonClick={mockOnPokemonClick}
        onSelectItem={mockOnSelectItem}
        onUnselectItem={mockOnUnselectItem}
        selectedItems={mockSelectedItems}
      />
    );
    mockData.forEach((pokemon) => {
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
    });
  });

  test('should display "No result found" when no data is available', () => {
    render(
      <CardList
        results={[]}
        onPokemonClick={mockOnPokemonClick}
        onSelectItem={mockOnSelectItem}
        onUnselectItem={mockOnUnselectItem}
        selectedItems={mockSelectedItems}
      />
    );
    expect(screen.getByText('No result found')).toBeInTheDocument();
  });

  test('should call onPokemonClick when a card is clicked', () => {
    render(
      <CardList
        results={mockData}
        onPokemonClick={mockOnPokemonClick}
        onSelectItem={mockOnSelectItem}
        onUnselectItem={mockOnUnselectItem}
        selectedItems={mockSelectedItems}
      />
    );
    const firstCard = screen.getByText(mockData[0].name);
    fireEvent.click(firstCard);

    expect(mockOnPokemonClick).toHaveBeenCalledWith(mockData[0]);
  });

  test('should display the correct number of Pokemon cards', () => {
    const mockData = [
      { name: 'bulbasaur', url: 'url1' },
      { name: 'ivysaur', url: 'url2' },
      { name: 'venusaur', url: 'url3' },
    ];

    render(
      <CardList
        results={mockData}
        onPokemonClick={mockOnPokemonClick}
        onSelectItem={mockOnSelectItem}
        onUnselectItem={mockOnUnselectItem}
        selectedItems={[]}
      />
    );
    expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1);
  });
});
