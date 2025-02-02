import React from 'react';

interface PokemonDetails {
  description: string;
  types: string;
  abilities: string;
  stats: string;
}

interface Pokemon {
  name: string;
  description?: PokemonDetails;
}

interface CardListProps {
  results: Pokemon[];
}

const CardList: React.FC<CardListProps> = ({ results }) => {
  console.log('Rendering results:', results);
  return (
    <div className="card-list-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={2}>No result found</td>
            </tr>
          ) : (
            results.map((pokemon, index) => (
              <tr key={index}>
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
                    <p>No details abailable</p>
                  )}
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
