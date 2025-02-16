import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemons: builder.query({
      query: (page = 1) => `pokemon?limit=20&offset=${(page - 1) * 20}`,
    }),
  }),
});

export const { useGetPokemonsQuery } = pokemonApi;
