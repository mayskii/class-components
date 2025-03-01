import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import ErrorBoundary from '../components/ErrorBoundary';
import { ThemeProvider } from '../src/context/ThemeProvider';
import { AppProps } from 'next/app';
import '../styles/App.css';

const App = ({ Component, pageProps }: AppProps) => {
  const resetError = () => {};

  return (
    <ErrorBoundary resetError={resetError}>
      <Provider store={store}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
