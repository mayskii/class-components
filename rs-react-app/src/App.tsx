import React, { Component } from 'react';
import Search from './components/Search';
import CardList from './components/CardList';
import Loader from './components/Loader';
import axios from 'axios';
// import './App.css';

interface AppState {
  items: { name: string; description: string }[];
  isLoading: boolean;
  error: string | null;
}

class App extends Component<object, AppState> {
  state = {
    items: [],
    isLoading: false,
    error: null,
  };

  fetchData = (searchTerm: string) => {
    this.setState({ isLoading: true, error: null });
    const url = searchTerm
      ? `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0&search=${searchTerm}`
      : `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`;

    axios
      .get(url)
      .then((responce) => {
        const items = responce.data.results.map((item: any) => ({
          name: item.name,
          description: 'No description available',
        }));
        this.setState({ items, isLoading: false });
      })
      .catch(() => {
        this.setState({
          error: 'Failed to fetch data. Please try again later',
          isLoading: false,
        });
      });
  };

  handleSearch = (searchTerm: string) => {
    this.fetchData(searchTerm);
  };

  

  render() {
    const { items, isLoading, error } = this.state;
    return (
      <div>
        <h1>Search App</h1>
        <Search onSearch={this.handleSearch} />
        {isLoading && <Loader />}
        <CardList items={items} />
      </div>
    );
  }
}

export default App;
