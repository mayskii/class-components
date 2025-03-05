import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CardList from './CardList';
import Card from './Card';
import Search from './Search';
import ErrorTest from './ErrorTest';
import useStorageSearch from '../src/hooks/useSrorageSearch';
import Pagination from './Pagination';
import {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
} from '../src/servises/pokemonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, resetItems } from '../src/selectedItemsSlice';
import { useTheme } from '../src/context/useTheme';

interface MainProps {
  searchTerm?: string;
}

interface PokemonDetails {
  description: string;
  types: string[];
  abilities: string[];
  stats: string[];
}

interface Pokemon {
  name: string;
  url: string;
  description?: PokemonDetails;
}

interface RootState {
  selectedItems: SelectedItemsState;
}

interface SelectedItemsState {
  selectedItems: Pokemon[];
}

const Main: React.FC<MainProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useStorageSearch('searchTerm', '');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasError, setHasError] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const selectedItems = useSelector(
    (state: RootState) => state.selectedItems.selectedItems
  );

  const {
    data: pokemonListResponse,
    error: pokemonListError,
    isLoading: pokemonListLoading,
  } = useGetPokemonListQuery({
    page: currentPage,
    searchTerm,
  });

  const { data: selectedPokemonData, isLoading: pokemonDetailsLoading } =
    useGetPokemonDetailsQuery(
      selectedPokemon ? selectedPokemon.name : skipToken
    );

  useEffect(() => {
    const { search, page, id } = router.query;

    if (typeof search === 'string' && search !== searchTerm) {
      setSearchTerm(search);
    }
    if (typeof page === 'string') {
      setCurrentPage(Number(page));
    }
    if (typeof id === 'string') {
      setSelectedPokemon({
        name: id,
        url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      });
    }
  }, [router.query, searchTerm, setSearchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    router.push(`?search=${term}&page=1`);
  };
  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const closePokemonDetails = () => {
    setSelectedPokemon(null);
  };

  const triggerError = () => {
    setHasError(true);
  };

  const filteredResults = Array.isArray(pokemonListResponse?.results)
    ? searchTerm.trim() === ''
      ? pokemonListResponse.results
      : pokemonListResponse.results.filter((pokemon: Pokemon) => {
          return pokemon.name
            .toLocaleLowerCase()
            .includes(searchTerm.toLowerCase());
        })
    : [];

  const totalPages = pokemonListResponse
    ? Math.ceil(filteredResults.length / 20)
    : 0;

  const renderErrorMessage = (error: unknown) => {
    if (error && typeof error === 'object' && error !== null) {
      if ('message' in error) {
        return `Error: ${(error as { message: string }).message}`;
      }
    }
    return 'An unknown error occurred while fetching the data.';
  };

  const handleSelectItem = (pokemon: Pokemon) => {
    dispatch(addItem(pokemon));
  };

  const handleUnselectItem = (pokemon: Pokemon) => {
    dispatch(removeItem(pokemon));
  };

  const handleUnselectAll = () => {
    dispatch(resetItems());
  };

  const handleDownloadSelected = () => {
    const selectedData = selectedItems.map((item: Pokemon) => ({
      name: item.name,
      url: item.url,
    }));
    const csvData = selectedData
      .map((row: Pokemon) => Object.values(row).join(','))
      .join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedItems.length}_selected_pokemon.csv`;
    link.click();
  };

  const resultsToShow = filteredResults.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  return (
    <div className={`app-container ${theme}`}>
      <>
        <div className={`top-controls ${theme}`}>
          <Search onSearch={handleSearch} />
          <button
            className={theme === 'light' ? 'light' : ''}
            onClick={toggleTheme}
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>

        {pokemonListLoading && (
          <div className="loader">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}

        {pokemonListError && (
          <div className="error-message">
            {renderErrorMessage(pokemonListError)}
          </div>
        )}

        {!pokemonListLoading &&
          !pokemonListError &&
          filteredResults.length > 0 && (
            <div className="main-content">
              <div
                className={`main-section ${!selectedPokemon ? 'right-section-hidden' : ''}`}
              >
                <div className="left-section">
                  <CardList
                    results={resultsToShow}
                    onPokemonClick={handlePokemonClick}
                    onSelectItem={handleSelectItem}
                    onUnselectItem={handleUnselectItem}
                    selectedItems={selectedItems}
                  />
                </div>

                {selectedPokemon && selectedPokemonData && (
                  <div className="right-section">
                    {selectedPokemon && selectedPokemonData && (
                      <div className="pokemon-details-container">
                        <button
                          className={`close-button ${theme}`}
                          onClick={closePokemonDetails}
                        >
                          Close
                        </button>
                      </div>
                    )}
                    <Card
                      pokemon={selectedPokemon}
                      details={selectedPokemonData}
                      detailsLoading={pokemonDetailsLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

        {!pokemonListLoading &&
          !pokemonListError &&
          filteredResults.length === 0 && (
            <div className="no-results-message">No results found</div>
          )}

        {!pokemonListLoading && totalPages > 1 && (
          <div className="pagination-controls">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                router.push(`?page=${page}`);
              }}
            />
          </div>
        )}

        <button className={`error-button ${theme}`} onClick={triggerError}>
          Throw Error
        </button>
        {hasError && <ErrorTest />}
      </>

      {selectedItems.length > 0 && (
        <div className={`flyout ${theme}`}>
          <div className="flyout-elements">
            {selectedItems.length} item(s) selected
          </div>
          <div className="flyout-buttons">
            <button
              className={theme === 'light' ? 'light' : ''}
              onClick={handleUnselectAll}
            >
              Unselect all
            </button>
            <button
              className={theme === 'light' ? 'light' : ''}
              onClick={handleDownloadSelected}
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
