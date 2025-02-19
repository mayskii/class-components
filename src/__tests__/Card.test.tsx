import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Card from '../components/Card';

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
  test('renders without crashing and displays Pokemon name', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const pokemonName = screen.getByText('bulbasaur', {
      selector: 'h2.pokemon-name',
    });
    expect(pokemonName).toBeTruthy();
  });

  it('renders the "Download Selected" button', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const downloadButton = screen.getByText('Download Selected');
    expect(downloadButton).toBeTruthy();
  });
  it('renders without crashing and displays Pokemon name', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const pokemonName = screen.getByText('bulbasaur', {
      selector: 'h2.pokemon-name',
    });
    expect(pokemonName).toBeTruthy();
  });

  it('renders the "Download Selected" button', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const downloadButton = screen.getByText('Download Selected');
    expect(downloadButton).toBeTruthy();
  });

  it('renders the "Unselect All" button', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const unselectButton = screen.getByText('Unselect All');
    expect(unselectButton).toBeTruthy();
  });
  it('renders without crashing and displays Pokemon name', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const pokemonName = screen.getByText('bulbasaur', {
      selector: 'h2.pokemon-name',
    });
    expect(pokemonName).toBeTruthy();
  });

  it('renders the "Download Selected" button', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const downloadButton = screen.getByText('Download Selected');
    expect(downloadButton).toBeTruthy();
  });

  it('renders the "Unselect All" button', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Card />
        </BrowserRouter>
      </Provider>
    );

    const unselectButton = screen.getByText('Unselect All');
    expect(unselectButton).toBeTruthy();
  });
});
