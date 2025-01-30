import React, { Component } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
}

interface SearchState {
  searchTerm: string;
}

class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    searchTerm: localStorage.getItem('searchTerm') || '',
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value.trim() });
  };

  handleSearchSubmit = () => {
    const { searchTerm } = this.state;
    if (searchTerm) {
      localStorage.setItem('searchTerm', this.state.searchTerm);
      this.props.onSearch(searchTerm);
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
