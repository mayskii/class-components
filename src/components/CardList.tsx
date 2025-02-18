import React from 'react';

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
  return (
    <div className="card-list-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Description</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={2}>No result found</td>
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
                  {pokemon.description ? (
                    <>
                      <p>
                        <strong>Description:</strong>{' '}
                        {pokemon.description.description}
                      </p>
                      <p>
                        <strong>Types:</strong> {pokemon.description.types}
                      </p>
                      <p>
                        <strong>Abilities:</strong>{' '}
                        {pokemon.description.abilities}
                      </p>
                      <p>
                        <strong>Stats:</strong> {pokemon.description.stats}
                      </p>
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
