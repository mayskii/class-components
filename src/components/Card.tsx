import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

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
const Card: React.FC = () => {
  const { pokemon, results } = useOutletContext<{
    pokemon: Pokemon | null;
    results: Pokemon[];
    detailsLoading: boolean;
  }>();
  const navigate = useNavigate();

  const [isRightSectionVisible, setIsRightSectionVisible] =
    useState<boolean>(true);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (pokemon && pokemon.url) {
      setDetailsLoading(true);
      setIsRightSectionVisible(true);
      setTimeout(() => {
        setDetailsLoading(false);
      }, 1500);
    }
  }, [pokemon]);

  const handlePokemonClick = (selectedPokemon: Pokemon) => {
    setIsRightSectionVisible(true);
    navigate(
      `/class-components/${selectedPokemon.name}?search=y&page=1&id=${selectedPokemon.name}&details=1`
    );
  };

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card">
      <div className="left-section">
        <div className="pokemon-summary">
          <h3>Item Name</h3>
          <ul>
            {results && results.length > 0 ? (
              results.map((pokemonItem) => (
                <li
                  key={pokemonItem.name}
                  onClick={() => handlePokemonClick(pokemonItem)}
                >
                  {pokemonItem.name}
                </li>
              ))
            ) : (
              <li>No results found</li>
            )}
          </ul>
        </div>
      </div>
      {isRightSectionVisible && (
        <div className="right-section">
          <h2 className="pokemon-name">{pokemon.name}</h2>
          {detailsLoading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <div className="info">
              {detailsLoading && (
                <div className="pokemon-loader-container">
                  <div className="pokemon-loader"></div>
                </div>
              )}
              <div className="pokemon-types">
                <h3>Types</h3>
                <ul>
                  {pokemon.description?.types.map((type, index) => (
                    <li key={index}>{type}</li>
                  ))}
                </ul>
              </div>
              <div className="pokemon-abilities">
                <h3>Abilities</h3>
                <ul>
                  {pokemon.description?.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
              <div className="pokemon-stats">
                <h3>Stats</h3>
                <ul>
                  {pokemon.description?.stats.map((stat, index) => (
                    <li key={index}>{stat}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
