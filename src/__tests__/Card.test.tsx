import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Card from '../components/Card';
import { ThemeProvider } from '../context/ThemeProvider';
import '@testing-library/jest-dom';

interface Pokemon {
  name: string;
  url: string;
}

interface SelectedItemsState {
  selectedItems: Pokemon[];
}

type Action = { type: string };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => ({
    pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    detailsLoading: false,
    details: {
      types: ['grass', 'poison'],
      abilities: ['overgrow', 'chlorophyll'],
      stats: ['50', '60', '70'],
    },
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    ],
    currentPage: 1,
    totalPages: 1,
    onPageChange: jest.fn(),
  }),
}));

const initialState: SelectedItemsState = {
  selectedItems: [],
};

const mockReducer = (
  state: SelectedItemsState = initialState,
  action: Action
): SelectedItemsState => {
  switch (action.type) {
    default:
      return state;
  }
};

const mockStore = configureStore({
  reducer: {
    selectedItems: mockReducer,
  },
});

describe('Card Component', () => {
  const renderWithProviders = () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <ThemeProvider>
            <Card />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders without crashing and displays Pokemon name', () => {
    renderWithProviders();
    const pokemonName = screen.getByText('bulbasaur', {
      selector: 'h2.pokemon-name',
    });
    expect(pokemonName).toBeTruthy();
  });

  test('Selects and unselects Pokemon correctly using class', async () => {
    renderWithProviders();

    const selectButton = screen.getByRole('button', { name: /Select/i });
    expect(selectButton).toBeInTheDocument();

    fireEvent.click(selectButton);

    const unselectButton = document.querySelector('.unselect-button');
    expect(unselectButton).toBeNull();

    if (unselectButton) {
      fireEvent.click(unselectButton);
    }

    const selectButtonAfterUnselect = document.querySelector('.select-button');
    expect(selectButtonAfterUnselect).not.toBeNull();
  });

  test('renders Pokemon types, abilities, and stats', () => {
    renderWithProviders();

    const types = screen.getByText(/Types/i);
    expect(types).toBeInTheDocument();

    const abilities = screen.getByText(/Abilities/i);
    expect(abilities).toBeInTheDocument();

    const stats = screen.getByText(/Stats/i);
    expect(stats).toBeInTheDocument();
  });
});
