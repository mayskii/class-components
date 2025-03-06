import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import ErrorBoundary from '../components/ErrorBoundary';
import { ThemeProvider } from '../src/context/ThemeProvider';
import '../styles/App.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resetError = () => {};

  return (
    <ErrorBoundary resetError={resetError}>
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
