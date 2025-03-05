import React from 'react';
import { useRouter } from 'next/router';
import { useGetPokemonDetailsQuery } from '../../src/servises/pokemonApi';
import Card from '../../components/Card';

const CardPage = () => {
  const router = useRouter();
  const { name } = router.query;

  const pokemonName = typeof name === 'string' ? name : '';

  const {
    data: selectedPokemonData,
    error: pokemonDetailsError,
    isLoading: pokemonDetailsLoading,
  } = useGetPokemonDetailsQuery(pokemonName);

  if (pokemonDetailsLoading) return <p>Loading...</p>;
  if (pokemonDetailsError) return <p>Error loading data</p>;

  const details = selectedPokemonData || {
    description: 'No description available',
    types: ['Unknown'],
    abilities: ['Unknown'],
    stats: ['Unknown'],
  };

  return (
    <Card
      pokemon={{
        name: pokemonName,
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`,
      }}
      details={details}
      detailsLoading={pokemonDetailsLoading}
    />
  );
};

export default CardPage;
