import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
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

interface PokemonDetails {
  description: string;
  types: string[];
  abilities: string[];
  stats: string[];
}

export interface Pokemon {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListResponse, { page: number }>({
      query: ({ page }) => {
        const offset = (page - 1) * 20;
        return `pokemon?limit=1000&offset=${offset}`;
      },
    }),

    getPokemonDetails: builder.query<PokemonDetails, string>({
      query: (url) => url,
      transformResponse: (response: {
        flavor_text_entries: FlavorTextEntry[];
        types: Type[];
        abilities: Ability[];
        stats: Stat[];
      }) => {
        const flavorTextEntries: FlavorTextEntry[] =
          response.flavor_text_entries;
        const description =
          flavorTextEntries?.find((entry) => entry.language.name === 'en')
            ?.flavor_text || 'No description available';

        const types = response.types.map((type: Type) => type.type.name);
        const abilities = response.abilities.map(
          (ability: Ability) => ability.ability.name
        );
        const stats = response.stats.map(
          (stat: Stat) => `${stat.stat.name}: ${stat.base_stat}`
        );

        return {
          description,
          types,
          abilities,
          stats,
        };
      },
    }),
  }),
});

export const { useGetPokemonListQuery, useGetPokemonDetailsQuery } = pokemonApi;
