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

const Main: React.FC<MainProps> = () => {
  const [searchTerm, setSearchTerm] = useStorageSearch('searchTerm', '');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasError, setHasError] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: pokemonList,
    error: pokemonListError,
    isLoading: pokemonListLoading,
  } = useGetPokemonListQuery({ page: currentPage });

  const { data: selectedPokemonData, isLoading: selectedPokemonLoading } =
    useGetPokemonDetailsQuery(
      selectedPokemon ? selectedPokemon.name : skipToken
    );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search') || searchTerm;
    const page = queryParams.get('page') || '1';
    const pokemonId = queryParams.get('id');

    setSearchTerm(search);
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

  const totalPages = pokemonList ? Math.ceil(pokemonList.length / 20) : 0;

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

  const filteredResults = pokemonList
    ? pokemonList.filter((pokemon) =>
        pokemon.name.toLocaleLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const renderErrorMessage = (error: unknown) => {
    if (error && typeof error === 'object' && error !== null) {
      if ('message' in error) {
        return `Error: ${(error as { message: string }).message}`;
      }
    }
    return 'An unknown error occurred while fetching the data.';
  };

  return (
    <div className="app-container">
      {!selectedPokemon && (
        <>
          <div className="top-controls">
            <Search onSearch={handleSearch} />
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
                    results={filteredResults}
                    onPokemonClick={handlePokemonClick}
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

          <button className="error-button" onClick={triggerError}>
            Throw Error
          </button>
          {hasError && <ErrorTest />}
        </>
      )}
      {selectedPokemon && selectedPokemonData && (
        <div className="pokemon-details-container">
          <div className="close-button" onClick={closePokemonDetails}>
            Close
          </div>
          <Outlet
            context={{
              pokemon: selectedPokemon,
              details: selectedPokemonData,
              detailsLoading: selectedPokemonLoading,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Main;
