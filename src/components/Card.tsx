import React from 'react';

interface CartProps {
  pokemon: Pokemon;
  onClose: () => void;
}

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

const Card: React.FC<CartProps> = ({ pokemon, onClose }) => {
  const { name, description } = pokemon;

  console.log('Pokemon description in Card:', description);

  const types =
    description?.types && description.types.length
      ? description.types.join(', ')
      : 'No types available';

  const abilities =
    description?.abilities && description.abilities.length
      ? description.abilities.join(', ')
      : 'No abilities available';

  const stats =
    description?.stats && description.stats.length
      ? description.stats.join(', ')
      : 'No stats available';

  return (
    <div className="card">
      <button onClick={onClose} className="close-button">
        Close
      </button>
      <h2>{name}</h2>
      <p>{description?.description || 'No description available'}</p>
      <p>
        <strong>Types:</strong> {types}
      </p>
      <p>
        <strong>Abilities:</strong> {abilities}
      </p>
      <p>
        <strong>Stats:</strong> {stats}
      </p>
    </div>
  );
};

export default Card;
