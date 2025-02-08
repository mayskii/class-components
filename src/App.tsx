import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import NotFoundPage from './components/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  const resetError = () => {};

  return (
    <ErrorBoundary resetError={resetError}>
      <Router>
        <Routes>
          <Route path="/class-components/" element={<Main searchTerm="" />} />
          <Route
            path="/class-components/search"
            element={<Main searchTerm="" />}
          />
          <Route
            path="/class-components/details/:id"
            element={<Main searchTerm="" />}
          />
          <Route
            path="/class-components/details/:id"
            element={<Main searchTerm="" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
