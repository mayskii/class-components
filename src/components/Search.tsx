import React from 'react';
import useStorageSearch from '../hooks/useSrorageSearch';

interface SearchProps {
  onSearch: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useStorageSearch('searchTerm', '');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    const trimmedTerm = searchTerm.trim();

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
        value={searchTerm}
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
