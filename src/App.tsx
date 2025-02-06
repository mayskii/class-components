import { Component } from 'react';
import Search from './components/Search';
import Main from './components/Main';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorTest from './components/ErrorTest';
import './App.css';

interface AppState {
  searchTerm: string;
  hasError: boolean;
}

class App extends Component<object, AppState> {
  state: AppState = {
    searchTerm: localStorage.getItem('searchTerm') || '',
    hasError: false,
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
    localStorage.setItem('searchTerm', term);
  };

  triggerError = () => {
    this.setState({
      hasError: true,
    });
  };

  resetError = () => {
    this.setState({
      hasError: false,
    });
  };
  render() {
    const { searchTerm, hasError } = this.state;
    return (
      <ErrorBoundary resetError={this.resetError}>
        <div className="app-container">
          <div className="top-controls">
            <Search searchTerm={searchTerm} onSearch={this.handleSearch} />
          </div>
          <Main searchTerm={searchTerm} />
          <button className="error-button" onClick={this.triggerError}>
            Throw Error
          </button>
          {hasError && <ErrorTest />}
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
