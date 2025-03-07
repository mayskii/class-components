'use client';

import React from 'react';
import Link from 'next/link';
import ErrorBoundary from '../components/ErrorBoundary';

export default function HomePage() {
  const resetError = () => {};

  return (
    <ErrorBoundary resetError={resetError}>
      <div className="home-container">
        <h1 className="home-title">Welcome to the Pokémon App!</h1>
        <Link href="/class-components" className="home-link">
          Go!!!
        </Link>
      </div>
    </ErrorBoundary>
  );
}
