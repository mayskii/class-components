import React from 'react';
import { useRouter } from 'next/router';
import {
  useGetPokemonDetailsQuery,
  useGetPokemonListQuery,
} from '../../src/servises/pokemonApi';
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

  const {
    data: pokemonListResponse,
    error: pokemonListError,
    isLoading: pokemonListLoading,
  } = useGetPokemonListQuery({
    page: 1,
    searchTerm: '',
  });

  if (pokemonDetailsLoading || pokemonListLoading) return <p>Loading...</p>;
  if (pokemonDetailsError || pokemonListError) return <p>Error loading data</p>;

  const details = selectedPokemonData || {
    description: 'No description available',
    types: ['Unknown'],
    abilities: ['Unknown'],
    stats: ['Unknown'],
  };

  const pokemon = {
    name: pokemonName,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`,
  };

  const results = pokemonListResponse?.results || [];

  return (
    <Card
      pokemon={pokemon}
      details={details}
      detailsLoading={pokemonDetailsLoading}
      results={results}
      currentPage={1}
      totalPages={1}
      onPageChange={() => {}}
    />
  );
};

export default CardPage;
