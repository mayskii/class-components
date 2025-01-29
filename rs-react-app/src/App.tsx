import React, { Component } from 'react';
import Search from './components/Search';
// import './App.css';

interface AppState {
  items: Array<{ name: string; description: string }>;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    items: [],
  };

  render() {
    return (
      <div>
        <Search />
      </div>
    );
  }
}

export default App;
