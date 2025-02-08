import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

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

interface Type {
  type: {
    name: string;
  };
}

interface Ability {
  ability: {
    name: string;
  };
}

interface Stat {
  stat: {
    name: string;
  };
  base_stat: number;
}

const Card: React.FC<CartProps> = ({ pokemon, onClose }) => {
  const { name, description } = pokemon;
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    if (!description) {
      setLoading(true);
      fetch(pokemon.url)
        .then((response) => response.json())
        .then((data) => {
          const fetchedDetails: PokemonDetails = {
            description:
              data.flavor_text_entries[0]?.flavor_text ||
              'No description available',
            types: data.types.map((type: Type) => type.type.name),
            abilities: data.abilities.map(
              (ability: Ability) => ability.ability.name
            ),
            stats: data.stats.map(
              (stat: Stat) => `${stat.stat.name}: ${stat.base_stat}`
            ),
          };
          setDetails(fetchedDetails);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [pokemon, description]);

  const types =
    details?.types && details.types.length
      ? details.types.join(', ')
      : description?.types?.join(', ') || 'No types available';

  const abilities =
    details?.abilities && details.abilities.length
      ? details.abilities.join(', ')
      : description?.abilities?.join(', ') || 'No abilities available';

  const stats =
    details?.stats && details.stats.length
      ? details.stats.join(', ')
      : description?.stats?.join(', ') || 'No stats available';

  return (
    <div className="card">
      <div className="card-header">
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>

      <div className="card-body">
        <div className="left-section" onClick={onClose}>
          <h2>{name}</h2>
          <p>{description?.description || 'No description available'}</p>
          <p>
            <strong>Types:</strong> {types}
          </p>
          <p>
            <strong>Abilities:</strong> {abilities}
          </p>
          <p>
            <strong>Stats:</strong> {stats}{' '}
          </p>
        </div>

        <div className="right-section">
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <div className="right-section-details">
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
