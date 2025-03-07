'use client';

import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo?: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log('getDerivedStateFromError:', error);
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error catch by ErrorBoundary', error);
    this.setState({ errorInfo: errorInfo.componentStack });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      errorInfo: null,
    });
    this.props.resetError();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong! </h2>
          {this.state.errorInfo && (
            <details>
              <summary>Error details</summary>
              <pre>{this.state.errorInfo}</pre>
            </details>
          )}
          <button onClick={this.handleRetry}>Try again!</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
