import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import CardList from './CardList';
import Search from './Search';
import axios from 'axios';
import ErrorTest from './ErrorTest';
import useStorageSearch from '../hooks/useSrorageSearch';
import Pagination from './Pagination';
import Card from './Card';

interface MainProps {
  searchTerm: string;
}

interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}
interface Type {
  type: {
    name: string;
  };
}

interface Ability {
  ability: {
    name: string;
  };
}

interface Stat {
  stat: {
    name: string;
  };
  base_stat: number;
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
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [resultsPerPage] = useState<number>(20);
  const [hasError, setHasError] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useStorageSearch('searchTerm', '');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [location]);

  const fetchPokemonDetails = useCallback(
    async (url: string): Promise<PokemonDetails> => {
      try {
        const response = await axios.get(url);

        const flavorTextEntries: FlavorTextEntry[] =
          response.data.flavor_text_entries;

        const description =
          flavorTextEntries?.find((entry) => entry.language.name === 'en')
            ?.flavor_text || 'No description avalable';

        const types = response.data.types
          ? response.data.types.map((type: Type) => type.type.name)
          : ['Types not available'];

        const abilities = response.data.abilities
          ? response.data.abilities.map(
              (ability: Ability) => ability.ability.name
            )
          : ['Abilities not available'];

        const stats = response.data.stats
          ? response.data.stats.map(
              (stat: Stat) => `${stat.stat.name}: ${stat.base_stat}`
            )
          : ['Stats not available'];

        return {
          description,
          types,
          abilities,
          stats,
        };
      } catch (error) {
        console.error('Error fetching details:', error);
        return {
          description: 'Description not available',
          types: ['Types not available'],
          abilities: ['Abilities not available'],
          stats: ['Stats not available'],
        };
      }
    },
    []
  );

  const fetchData = useCallback(
    (searchTerm: string, page: number) => {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * resultsPerPage;

      axios
        .get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
        .then(async (response) => {
          const allResults = response.data.results;

          const filteredResults = allResults.filter((pokemon: Pokemon) =>
            pokemon.name
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase())
          );

          const resultsWithDetails = await Promise.all(
            filteredResults.map(async (pokemon: Pokemon) => {
              const description = await fetchPokemonDetails(pokemon.url);
              return { ...pokemon, description };
            })
          );
          const totalFilteredResults = filteredResults.length;
          const paginatedResults = resultsWithDetails.slice(
            offset,
            offset + resultsPerPage
          );

          setLoading(false);
          setResults(paginatedResults);
          setTotalResults(totalFilteredResults);
        })
        .catch((error: unknown) => {
          setLoading(false);
          if (error instanceof Error) {
            setError(error.message || 'An error occurred');
          } else {
            setError('An unknown error occurred');
          }
        });
    },
    [resultsPerPage, fetchPokemonDetails]
  );

  const fetchPokemonById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;

        const response = await axios.get(url);
        const details = await fetchPokemonDetails(url);

        setLoading(false);
        setResults([
          {
            name: response.data.name,
            url: response.data.url,
            description: details,
          },
        ]);
      } catch {
        setLoading(false);
        setError('Pokemon not found');
      }
    },
    [fetchPokemonDetails]
  );

  useEffect(() => {
    if (id) {
      fetchPokemonById(id);
    } else if (searchTerm) {
      fetchData(searchTerm, currentPage);
    }
  }, [searchTerm, currentPage, id, fetchData, fetchPokemonById]);

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    navigate(`?search=${term}&page=1`);
  };
  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    navigate(`/class-components/?id=${pokemon.name}&details=1`);
  };

  const closeDetails = () => {
    setSelectedPokemon(null);
    navigate(`/class-components/`);
  };

  const triggerError = () => {
    setHasError(true);
  };

  return (
    <div className="app-container">
      {!selectedPokemon && (
        <div className="top-controls">
          <Search onSearch={handleSearch} />
        </div>
      )}

      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && results.length > 0 && !selectedPokemon && (
        <div className="main-content">
          <div className="main-section">
            <CardList results={results} onPokemonClick={handlePokemonClick} />
          </div>
        </div>
      )}

      {!loading && !error && selectedPokemon && (
        <div className="main-content">
          <div className="main-section">
            <Card pokemon={selectedPokemon} onClose={closeDetails} />
          </div>
        </div>
      )}

      {!loading && !error && results.length === 0 && !selectedPokemon && (
        <div className="no-results-message">No results found</div>
      )}
      {!loading && totalPages > 1 && !selectedPokemon && (
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
      {!selectedPokemon && (
        <button className="error-button" onClick={triggerError}>
          Throw Error
        </button>
      )}
      {hasError && <ErrorTest />}
    </div>
  );
};

export default Main;
