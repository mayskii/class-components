import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Pokémon App!</h1>
      <Link href="/class-components">Go!!!</Link>
    </div>
  );
};

export default HomePage;
