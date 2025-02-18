import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // To wrap the component with a router
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'; // Use configureStore instead of createStore
import Card from '../components/Card'; // Adjust the path according to your file structure

// Define the Pokemon type
interface Pokemon {
  name: string;
  url: string;
}

// Define the initial state type
interface SelectedItemsState {
  selectedItems: Pokemon[];
}

// Define the reducer action type (for now we use a generic 'any' type for action)
type Action = { type: string };

// Mocking the outlet context to avoid breaking the test (use mock data)
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

// Create a mock reducer and initial state for the store
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
  it('renders without crashing and displays Pokemon name', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    // Check if the Pokemon name is visible in the card
    const pokemonName = screen.getByText('bulbasaur', {
      selector: 'h2.pokemon-name',
    });
    expect(pokemonName).toBeTruthy();
  });
});
