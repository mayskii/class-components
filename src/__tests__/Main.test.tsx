import { render, fireEvent, screen } from '@testing-library/react';
import Main from '../../components/Main';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import {
  useGetPokemonListQuery,
  pokemonApi,
  useGetPokemonDetailsQuery,
} from '../servises/pokemonApi';
import { useRouter } from 'next/router';
import selectedItemsReducer from '../selectedItemsSlice';
import { Middleware, Action, Reducer } from '@reduxjs/toolkit';
import { ThemeProvider } from '../context/ThemeProvider';
import ErrorBoundary from '../../components/ErrorBoundary';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../servises/pokemonApi', () => ({
  useGetPokemonListQuery: jest.fn(),
  useGetPokemonDetailsQuery: jest.fn(),
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: ((state = { results: [] }) => state) as Reducer,
    middleware: (() => (next) => (action: Action) =>
      next(action)) as Middleware,
  },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

describe('Main Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: {},
    });

    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: { results: [] },
      error: null,
      isLoading: false,
    });

    (useGetPokemonDetailsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    (useSelector as unknown as jest.Mock).mockReturnValue([
      { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
    ]);
  });

  test('renders loading state while data is being fetched', () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when there is an error fetching data', async () => {
    const mockError = new Error('API request failed');
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </Provider>
    );

    const errorMessage = await screen.findByText(/Error: API request failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('toggles theme when the theme button is clicked', () => {
    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </Provider>
    );

    const themeToggleButton = screen.getByRole('button', { name: /light/i });
    fireEvent.click(themeToggleButton);

    expect(screen.getByTestId('app-container')).toHaveClass('light');

    fireEvent.click(themeToggleButton);
    expect(screen.getByTestId('app-container')).toHaveClass('dark');
  });

  test('allows user to select and unselect pokemon items', async () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
        ],
      },
      error: null,
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </Provider>
    );

    fireEvent.click(await screen.findByText('Pikachu'));
    expect(screen.getByText('Pikachu')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Pikachu'));
    expect(screen.queryByText('Pikachu')).toBeInTheDocument();
  });
  test('handles error button click and displays error message', () => {
    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <ErrorBoundary resetError={() => {}}>
            <Main />
          </ErrorBoundary>
        </ThemeProvider>
      </Provider>
    );

    const errorButton = screen.getByRole('button', { name: /throw error/i });
    fireEvent.click(errorButton);

    const errorMessage = screen.getByText(/Something went wrong!/i);
    expect(errorMessage).toBeInTheDocument();
  });
  test('downloads selected pokemon as CSV when clicking download button', () => {
    const createObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock;

    const selectedItems = [
      { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
      { name: 'Bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur' },
    ];

    (useSelector as unknown as jest.Mock).mockReturnValue(selectedItems);

    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </Provider>
    );

    const downloadButton = screen.getByRole('button', { name: /Download/i });
    fireEvent.click(downloadButton);

    expect(createObjectURLMock).toHaveBeenCalled();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([]));
    link.download = '2_selected_pokemon.csv';
    expect(link.download).toBe('2_selected_pokemon.csv');
  });
});
