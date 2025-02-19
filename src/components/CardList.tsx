import React from 'react';
import { useTheme } from '../context/useTheme';

interface PokemonDetails {
  description: string;
  types: string[];
  abilities: string[];
  stats: string[];
}
interface Pokemon {
  name: string;
  url: string;
  description?: PokemonDetails;
}
interface CardListProps {
  results: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  onSelectItem: (pokemon: Pokemon) => void;
  onUnselectItem: (pokemon: Pokemon) => void;
  selectedItems: Pokemon[];
}
const CardList: React.FC<CardListProps> = ({
  results,
  onPokemonClick,
  onSelectItem,
  onUnselectItem,
  selectedItems = [],
}) => {
  const handleSelect = (pokemon: Pokemon) => {
    if (selectedItems.some((item) => item.name === pokemon.name)) {
      onUnselectItem(pokemon);
    } else {
      onSelectItem(pokemon);
    }
  };
  const { theme } = useTheme();

  return (
    <div className={`card-list-container ${theme}`} data-testid="card-list">
      <table className={`card-table ${theme}`}>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Description(URL)</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={3}>No result found</td>
            </tr>
          ) : (
            results.map((pokemon) => (
              <tr
                key={pokemon.name}
                onClick={() => onPokemonClick(pokemon)}
                className={
                  selectedItems.some((item) => item.name === pokemon.name)
                    ? 'selected'
                    : ''
                }
              >
                <td>{pokemon.name}</td>
                <td>
                  {pokemon ? (
                    <>
                      <strong>URL:</strong>{' '}
                      <a href={pokemon.url}>{pokemon.url}</a>
                    </>
                  ) : (
                    <p>No details available</p>
                  )}
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(pokemon);
                    }}
                    className={
                      selectedItems.some((item) => item.name === pokemon.name)
                        ? 'unselect-button'
                        : 'select-button'
                    }
                  >
                    {selectedItems.some((item) => item.name === pokemon.name)
                      ? 'Unselect'
                      : 'Select'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CardList;
