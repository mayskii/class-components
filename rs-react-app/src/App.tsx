import React, { Component } from 'react';
import Search from './components/Search';
import Main from './components/Main';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

interface AppState {
  searchTerm: string;
}

class App extends Component<object, AppState> {
  state: AppState = {
    searchTerm: '',
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
    localStorage.setItem('searchTerm', term);
  };

  render() {
    const { searchTerm } = this.state;
    return (
      <div className="app-container">
        <ErrorBoundary>
          <div className="top-controls">
            <Search onSearch={this.handleSearch} />
          </div>
          <Main searchTerm={searchTerm} />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
