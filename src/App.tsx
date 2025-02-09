import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Card from './components/Card';
import NotFoundPage from './components/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  const resetError = () => {};

  return (
    <ErrorBoundary resetError={resetError}>
      <Router>
        <Routes>
          <Route path="/class-components/" element={<Main searchTerm="" />}>
            <Route path=":id" element={<Card />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
