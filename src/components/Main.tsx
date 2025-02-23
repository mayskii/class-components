import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CardList from './CardList';
import Search from './Search';
import ErrorTest from './ErrorTest';
import useStorageSearch from '../hooks/useSrorageSearch';
import Pagination from './Pagination';
import { Outlet } from 'react-router-dom';
import {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
} from '../servises/pokemonApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, resetItems } from '../selectedItemsSlice';
import { useTheme } from '../context/useTheme';

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

  const navigate = useNavigate();
  const location = useLocation();
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

  const { data: selectedPokemonData, isLoading: selectedPokemonLoading } =
    useGetPokemonDetailsQuery(
      selectedPokemon ? selectedPokemon.url : skipToken
    );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || searchTerm;
    const page = queryParams.get('page') || '1';
    const pokemonId = queryParams.get('id');

    if (search !== searchTerm) {
      setSearchTerm(search);
    }
    setCurrentPage(Number(page));

    if (pokemonId) {
      setSelectedPokemon({
        name: pokemonId,
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
      });
    } else if (search) {
      setCurrentPage(Number(page));
    }
  }, [location.search, searchTerm, setSearchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    navigate(`?search=${term}&page=1`);
  };
  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    const navigateTo = `${pokemon.name}?search=${searchTerm}&page=${currentPage}&id=${pokemon.name}&details=1`;
    navigate(navigateTo);
  };

  const closePokemonDetails = () => {
    setSelectedPokemon(null);
    navigate('?search=' + searchTerm + '&page=1');
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
      {!selectedPokemon && (
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
                <div className="main-section">
                  <CardList
                    results={resultsToShow}
                    onPokemonClick={handlePokemonClick}
                    onSelectItem={handleSelectItem}
                    onUnselectItem={handleUnselectItem}
                    selectedItems={selectedItems}
                  />
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
                  navigate(`?page=${page}`);
                }}
              />
            </div>
          )}

          <button className={`error-button ${theme}`} onClick={triggerError}>
            Throw Error
          </button>
          {hasError && <ErrorTest />}
        </>
      )}
      {selectedPokemon && selectedPokemonData && (
        <div className="pokemon-details-container">
          <button
            className={`close-button ${theme}`}
            onClick={closePokemonDetails}
          >
            Close
          </button>
          <Outlet
            context={{
              results: resultsToShow,
              pokemon: selectedPokemon,
              details: selectedPokemonData,
              detailsLoading: selectedPokemonLoading,
              currentPage: currentPage,
              totalPages: totalPages,
              onPageChange: (page: number) => {
                setCurrentPage(page);
                navigate(`?page=${page}`);
              },
            }}
          />
        </div>
      )}
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
