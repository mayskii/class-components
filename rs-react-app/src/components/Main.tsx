import React, { Component } from 'react';
import CardList from './CardList';
import axios from 'axios';

interface Pokemon {
  name: string;
  url: string;
  description?: PokemonDetails;
}

interface MainState {
  loading: boolean;
  error: string | null;
  results: Pokemon[];
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

class Main extends Component<MainProps, MainState> {
  state = {
    loading: false,
    error: null,
    results: [],
  };

  fetchPokemonDetails = async (url: string): Promise<PokemonDetails> => {
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

  fetchData = (searchTerm: string) => {
    this.setState({ loading: true, error: null });

    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
      .then(async (response) => {
        if (response.data && Array.isArray(response.data.results)) {
          const filteredResults = await Promise.all(
            response.data.results
              .filter((pokemon: Pokemon) =>
                pokemon.name
                  .toLocaleLowerCase()
                  .includes(searchTerm.toLocaleLowerCase())
              )
              .map(async (pokemon: Pokemon) => {
                const description = await this.fetchPokemonDetails(pokemon.url);
                return { ...pokemon, description };
              })
          );
          this.setState({
            loading: false,
            results: filteredResults,
          });
        } else {
          this.setState({
            loading: false,
            error: 'Unexpected response structure.',
          });
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.setState({
            loading: false,
            error: error.message || 'An error occurred',
          });
        } else {
          this.setState({
            loading: false,
            error: 'An unknown error occurred',
          });
        }
      });
  };

  componentDidMount(): void {
    const searchTerm = localStorage.getItem('searchTerm') || '';
    this.fetchData(searchTerm);
  }

  componentDidUpdate(prevProps: MainProps): void {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.fetchData(this.props.searchTerm);
    }
  }

  render() {
    const { loading, error, results } = this.state;
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
          <div>No results found.</div>
        )}
      </div>
    );
  }
}

export default Main;
