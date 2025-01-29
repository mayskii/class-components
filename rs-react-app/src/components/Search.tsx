import React, { Component } from 'react';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
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
      this.props.onSearch(this.state.searchTerm);
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleSearchChange}
        />
        <button onClick={this.handleSearchSubmit}>Search</button>
      </div>
    );
  }
}

export default Search;
