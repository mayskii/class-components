import React, { Component } from 'react';
import Search from './components/Search';
import CardList from './components/CardList';
import Loader from './components/Loader';
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
