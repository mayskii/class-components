import React, { Component } from 'react';
import CardList from './CardList';
import axios from 'axios';

interface Pokemon {
  name: string;
  url: string;
}

interface MainState {
  loading: boolean;
  error: string | null;
  results: Pokemon[];
}

interface MainProps {
  searchTerm: string;
}

class Main extends Component<MainProps, MainState> {
  state = {
    loading: false,
    error: null,
    results: [],
  };

  fetchData = (searchTerm: string) => {
    this.setState({ loading: true, error: null });

    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.results)) {
          const filteredResults = response.data.results.filter(
            (pokemon: Pokemon) =>
              pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) // фильтрация по имени
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
