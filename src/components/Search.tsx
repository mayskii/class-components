import React, { useState } from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, searchTerm }) => {
  const [term, setTerm] = useState(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    const trimmedTerm = term.trim();

    if (trimmedTerm) {
      localStorage.setItem('searchTerm', trimmedTerm);
      onSearch(trimmedTerm);
    }
  };

  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        value={term}
        onChange={handleSearchChange}
        placeholder="Enter search term"
      />
      <button className="search-button" onClick={handleSearchSubmit}>
        Search
      </button>
    </div>
  );
};

export default Search;
