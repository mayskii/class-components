import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Pokémon App!</h1>
      <Link href="/class-components" className="home-link">
        Go!!!
      </Link>
    </div>
  );
};

export default HomePage;
