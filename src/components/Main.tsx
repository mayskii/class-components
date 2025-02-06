import React, { useEffect, useState } from 'react';
import CardList from './CardList';
import axios from 'axios';

interface Pokemon {
  name: string;
  url: string;
  description?: PokemonDetails;
}

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
  types: string;
  abilities: string;
  stats: string;
}

const Main: React.FC<MainProps> = ({ searchTerm }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [resultsPerPage] = useState<number>(20);

  const fetchPokemonDetails = async (url: string): Promise<PokemonDetails> => {
    try {
      const response = await axios.get(url);

      const flavorTextEntries: FlavorTextEntry[] =
        response.data.flavor_text_entries;

      const description =
        flavorTextEntries?.find((entry) => entry.language.name === 'en')
          ?.flavor_text || 'No description avalable';

      const types = response.data.types
        .map((type: Type) => type.type.name)
        .join(', ');

      const abilities = response.data.abilities
        .map((ability: Ability) => ability.ability.name)
        .join(', ');

      const stats = response.data.stats
        .map((stat: Stat) => `${stat.stat.name}: ${stat.base_stat}`)
        .join(', ');

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
        types: 'Types not available',
        abilities: 'Abilities not available',
        stats: 'Stats not available',
      };
    }
  };

  const fetchData = (searchTerm: string, page: number) => {
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
  };

  useEffect(() => {
    fetchData(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  // useEffect(() => {
  //   const searchTermFromStorage = localStorage.getItem('searcTerm') || '';
  //   fetchData(searchTermFromStorage, currentPage);
  // }, [currentPage]);

  // useEffect(() => {
  //   setCurrentPage(1);
  //   fetchData(searchTerm, 1);
  // }, [searchTerm]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="results">
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && results.length > 0 && (
        <CardList results={results} />
      )}
      {!loading && !error && results.length === 0 && (
        <div>No results found</div>
      )}
      <div className="pagination-controls">
        {currentPage > 1 && (
          <button onClick={handlePreviousPage} className="pagination-button">
            Previous
          </button>
        )}
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages && (
          <button onClick={handleNextPage} className="pagination-button">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Main;
