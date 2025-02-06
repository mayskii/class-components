import React, { useState } from 'react';
import Search from './components/Search';
import Main from './components/Main';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorTest from './components/ErrorTest';
import useStorageSearch from './hooks/useSrorageSearch';
import './App.css';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useStorageSearch('searchTerm', '');
  const [hasError, setHasError] = useState<boolean>(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const triggerError = () => {
    setHasError(true);
  };

  const resetError = () => {
    setHasError(false);
  };

  return (
    <ErrorBoundary resetError={resetError}>
      <div className="app-container">
        <div className="top-controls">
          <Search onSearch={handleSearch} />
        </div>
        <Main searchTerm={searchTerm} />
        <button className="error-button" onClick={triggerError}>
          Throw Error
        </button>
        {hasError && <ErrorTest />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
