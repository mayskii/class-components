import { fireEvent, render, screen } from '@testing-library/react';
import CardList from '../../components/CardList';
import '@testing-library/jest-dom';
import { Pokemon } from '../servises/pokemonApi';
import { Provider } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeProvider } from '../context/ThemeProvider';

const mockData = [
  { name: 'bulbasaur', url: 'url1' },
  { name: 'ivysaur', url: 'url2' },
];

const mockOnPokemonClick = jest.fn();
const mockOnSelectItem = jest.fn();
const mockOnUnselectItem = jest.fn();
const mockSelectedItems: Pokemon[] = [];

interface SelectedItemsState {
  selectedItems: Pokemon[];
}

const initialState: SelectedItemsState = {
  selectedItems: mockSelectedItems,
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Pokemon>) => {
      state.selectedItems.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<Pokemon>) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => item.name !== action.payload.name
      );
    },
  },
});

const mockStore = configureStore({
  reducer: {
    selectedItems: selectedItemsSlice.reducer,
  },
});

describe('CardList', () => {
  const renderWithProviders = () => {
    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <CardList
            results={mockData}
            onPokemonClick={mockOnPokemonClick}
            onSelectItem={mockOnSelectItem}
            onUnselectItem={mockOnUnselectItem}
            selectedItems={mockSelectedItems}
          />
        </ThemeProvider>
      </Provider>
    );
  };

  test('renders correctly with mock data', () => {
    renderWithProviders();
    mockData.forEach((pokemon) => {
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
    });
  });

  test('should render a list of cards when data is provided', () => {
    renderWithProviders();
    mockData.forEach((pokemon) => {
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
    });
  });

  test('should call onPokemonClick when a card is clicked', () => {
    renderWithProviders();
    const firstCard = screen.getByText(mockData[0].name);
    fireEvent.click(firstCard);

    expect(mockOnPokemonClick).toHaveBeenCalledWith(mockData[0]);
  });

  test('should display the correct number of Pokemon cards', () => {
    const mockData = [
      { name: 'bulbasaur', url: 'url1' },
      { name: 'ivysaur', url: 'url2' },
      { name: 'venusaur', url: 'url3' },
    ];

    renderWithProviders();
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mockData.length);
  });

  test('should display Pokémon URL in the description column', () => {
    renderWithProviders();
    mockData.forEach((pokemon) => {
      const urlText = screen.getByText(pokemon.url);
      expect(urlText).toBeInTheDocument();
    });
  });
  test('should not render empty rows', () => {
    renderWithProviders();
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('renders list of Pokémon cards with URLs and select buttons', () => {
    renderWithProviders();

    mockData.forEach((pokemon) => {
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
      expect(screen.getByText(pokemon.url)).toBeInTheDocument();

      expect(
        screen.getByTestId(`select-button-${pokemon.name}`)
      ).toBeInTheDocument();
    });
  });
  test('should display "No result found" when results is empty', () => {
    renderWithProviders();

    // Обновляем данные, чтобы results было пустым
    const emptyData: Pokemon[] = [];

    render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <CardList
            results={emptyData}
            onPokemonClick={mockOnPokemonClick}
            onSelectItem={mockOnSelectItem}
            onUnselectItem={mockOnUnselectItem}
            selectedItems={mockSelectedItems}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('No result found')).toBeInTheDocument();
  });

  test('should render pokemon details when results is populated', () => {
    renderWithProviders();

    mockData.forEach((pokemon) => {
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
      expect(screen.getByText(pokemon.url)).toBeInTheDocument();
    });
  });

  test('should call onUnselectItem when a Pokemon is already selected', () => {
    const mockOnSelectItem = jest.fn();
    const mockOnUnselectItem = jest.fn();
    const mockData = [
      { name: 'bulbasaur', url: 'url1' },
      { name: 'ivysaur', url: 'url2' },
    ];

    const mockSelectedItems = [mockData[0]];

    const renderWithProviders = () => {
      render(
        <Provider store={mockStore}>
          <ThemeProvider>
            <CardList
              results={mockData}
              onPokemonClick={mockOnPokemonClick}
              onSelectItem={mockOnSelectItem}
              onUnselectItem={mockOnUnselectItem}
              selectedItems={mockSelectedItems}
            />
          </ThemeProvider>
        </Provider>
      );
    };

    renderWithProviders();

    const unselectButton = screen.getAllByText('Unselect')[0];

    fireEvent.click(unselectButton);

    expect(mockOnUnselectItem).toHaveBeenCalledWith(mockData[0]);
    expect(mockOnSelectItem).not.toHaveBeenCalled();
  });
});
