import React from 'react';
import { useOutletContext } from 'react-router-dom';

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
  const { pokemon } = useOutletContext<{ pokemon: Pokemon }>();

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  console.log(pokemon);

  return (
    <div className="card">
      <h2>{pokemon.name}</h2>
      <p>{pokemon.description?.description}</p>
      <ul>
        {pokemon.description?.types.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
      <ul>
        {pokemon.description?.abilities.map((ability, index) => (
          <li key={index}>{ability}</li>
        ))}
      </ul>
      <ul>
        {pokemon.description?.stats.map((stat, index) => (
          <li key={index}>{stat}</li>
        ))}
      </ul>
    </div>
  );
};

export default Card;
