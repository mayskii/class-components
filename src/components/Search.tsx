import React, { Component } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

interface SearchState {
  searchTerm: string;
}

class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    searchTerm: '',
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
  };

  handleSearchSubmit = () => {
    const { searchTerm } = this.state;
    const trimmedTerm = searchTerm.trim();

    if (trimmedTerm) {
      localStorage.setItem('searchTerm', trimmedTerm);
      this.props.onSearch(trimmedTerm);
    }
  };

  render() {
    return (
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleSearchChange}
          placeholder="Enter search term"
        />
        <button className="search-button" onClick={this.handleSearchSubmit}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
