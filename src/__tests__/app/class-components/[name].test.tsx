import { render, screen } from '@testing-library/react';
import CardPage from '../../../../app/class-components/[name]/page';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import { useGetPokemonDetailsQuery } from '../../../servises/pokemonApi';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../../../servises/pokemonApi';
import type { Middleware } from '@reduxjs/toolkit';

interface PokemonDetails {
  description: string;
  types: string[];
  abilities: string[];
  stats: string[];
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../servises/pokemonApi', () => {
  const actualModule = jest.requireActual('../../../servises/pokemonApi');

  return {
    ...actualModule,
    useGetPokemonDetailsQuery: jest.fn(),
    pokemonApi: {
      ...actualModule.pokemonApi,
      reducer: (state = {}) => state,
      middleware: (() =>
        (next: (action: unknown) => unknown) =>
        (action: unknown) =>
          next(action)) as Middleware,
    },
  };
});

const mockStore = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

const mockUseRouter = (name: string) => {
  (useRouter as jest.Mock).mockReturnValue({
    query: { name },
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  });
};

const mockUseGetPokemonDetailsQuery = (
  data: PokemonDetails | null,
  isLoading: boolean = false,
  error: Error | null = null
) => {
  (useGetPokemonDetailsQuery as jest.Mock).mockReturnValue({
    data,
    isLoading,
    error,
  });
};

describe('CardPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Show loading message', () => {
    mockUseRouter('pikachu');
    mockUseGetPokemonDetailsQuery(null, true);

    render(
      <Provider store={mockStore}>
        <CardPage />
      </Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('Check API error', () => {
    mockUseRouter('bulbasaur');
    mockUseGetPokemonDetailsQuery(null, false, new Error('API Error'));

    render(
      <Provider store={mockStore}>
        <CardPage />
      </Provider>
    );

    expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
  });
});
