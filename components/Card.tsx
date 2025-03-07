'use client';

import React from 'react';
import { useTheme } from '../src/context/useTheme';

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

interface CardProps {
  pokemon: Pokemon | null;
  details: PokemonDetails | null;
  detailsLoading: boolean;
}

const Card: React.FC<CardProps> = ({ pokemon, details, detailsLoading }) => {
  const { theme } = useTheme();

  if (!pokemon || !details) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`card ${theme}`}>
      {detailsLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <div className={`info ${theme}`}>
          <div className="pokemon-name">
            <ul>{pokemon.name}</ul>
          </div>
          <div className="pokemon-types">
            <h3>Types</h3>
            <ul>
              {details?.types.map((type, index) => <li key={index}>{type}</li>)}
            </ul>
          </div>
          <div className="pokemon-abilities">
            <h3>Abilities</h3>
            <ul>
              {details?.abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          </div>
          <div className="pokemon-stats">
            <h3>Stats</h3>
            <ul>
              {details?.stats.map((stat, index) => <li key={index}>{stat}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
