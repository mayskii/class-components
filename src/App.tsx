import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './components/Search';
import Main from './components/Main';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorTest from './components/ErrorTest';
import useStorageSearch from './hooks/useSrorageSearch';
import NotFoundPage from './components/NotFoundPage';
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
      <Router>
        <div className="app-container">
          <div className="top-controls">
            <Search onSearch={handleSearch} />
          </div>
          <Routes>
            <Route
              path="/class-components/"
              element={<Main searchTerm={searchTerm} />}
            />
            <Route
              path="/class-components/search"
              element={<Main searchTerm={searchTerm} />}
            />
            <Route
              path="/class-components/details/:id"
              element={<Main searchTerm={searchTerm} />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <button className="error-button" onClick={triggerError}>
            Throw Error
          </button>
          {hasError && <ErrorTest />}
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
