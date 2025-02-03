import { Component } from 'react';
import Search from './components/Search';
import Main from './components/Main';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

interface AppState {
  searchTerm: string;
}

class App extends Component<object, AppState> {
  state: AppState = {
    searchTerm: localStorage.getItem('searchTerm') || '',
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
    localStorage.setItem('searchTerm', term);
  };

  throwError = () => {
    throw new Error('This is error for testing');
  };

  render() {
    const { searchTerm } = this.state;
    return (
      <div className="app-container">
        <ErrorBoundary>
          <div className="top-controls">
            <Search searchTerm={searchTerm} onSearch={this.handleSearch} />
          </div>
          <Main searchTerm={searchTerm} />
        </ErrorBoundary>
        <button className="error-button" onClick={this.throwError}>
          Throw Error
        </button>
      </div>
    );
  }
}

export default App;
