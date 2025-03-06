import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../../components/Card';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../context/ThemeProvider';

test('renders Pokemon name and details', async () => {
  const pokemon = {
    name: 'Pikachu',
    types: ['electric'],
    abilities: ['static'],
    stats: { speed: 90, attack: 55 },
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
    description: {
      description: 'Electric type Pokemon',
      types: ['electric'],
      abilities: ['static'],
      stats: ['speed: 90', 'attack: 55'],
    },
  };

  render(
    <ThemeProvider>
      {' '}
      <Card
        pokemon={pokemon}
        details={pokemon.description}
        detailsLoading={false}
      />
    </ThemeProvider>
  );

  expect(screen.getByText('Pikachu')).toBeInTheDocument();

  expect(await screen.findByText(/electric/i)).toBeInTheDocument();

  expect(screen.getByText('electric')).toBeInTheDocument();

  expect(screen.getByText('static')).toBeInTheDocument();

  expect(screen.getByText('speed: 90')).toBeInTheDocument();
  expect(screen.getByText('attack: 55')).toBeInTheDocument();
});

it('renders loading state', () => {
  render(
    <ThemeProvider>
      <Card pokemon={null} details={null} detailsLoading={true} />
    </ThemeProvider>
  );

  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

import '@testing-library/jest-dom';

test('dummy test', () => {
  expect(true).toBe(true);
});
