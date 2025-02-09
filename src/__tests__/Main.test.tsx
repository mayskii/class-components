import { render, screen, fireEvent } from '@testing-library/react';
import Main from '../components/Main';
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';
import Pagination from '../components/Pagination';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({
  data: { results: [{ name: 'bulbasaur' }] },
});

describe('Main Component', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <Main />
      </Router>
    );

    const errorButton = screen.getByRole('button', { name: /Throw Error/i });
    expect(errorButton).toBeTruthy();
  });

  test('has an error button', () => {
    render(
      <Router>
        <Main />
      </Router>
    );

    const errorButton = screen.getByRole('button', { name: /Throw Error/i });
    expect(errorButton).toBeTruthy();
  });
  test('has a search input field', () => {
    render(
      <Router>
        <Main />
      </Router>
    );
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).not.toBeNull();
  });

  test('renders no results found message when search has no matches', () => {
    render(
      <Router>
        <Main />
      </Router>
    );
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'nonexistentpokemon' } });
    const noResultsMessage = screen.queryByText('No results found');
    expect(noResultsMessage).not.toBeNull();
  });

  test('closes Pokémon details when close button is clicked', () => {
    render(
      <Router>
        <Main />
      </Router>
    );
    const pokemonCard = screen.queryByText('Bulbasaur');
    if (pokemonCard) fireEvent.click(pokemonCard);

    const closeButton = screen.queryByText('Close');
    if (closeButton) fireEvent.click(closeButton);

    const pokemonDetails = screen.queryByText('Bulbasaur');
    expect(pokemonDetails).toBeNull();
  });

  test('should call onPageChange when Next button is clicked', () => {
    const onPageChangeMock = jest.fn();

    render(
      <MemoryRouter>
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChangeMock}
        />
      </MemoryRouter>
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });
  test('displays "No results found" message when no pokemon match search term', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { results: [] },
    });

    render(
      <Router>
        <Main />
      </Router>
    );

    const noResultsMessage = await screen.findByText('No results found');
    expect(noResultsMessage).toBeTruthy();
  });

  test('displays error message when API call fails', async () => {
    jest
      .spyOn(axios, 'get')
      .mockRejectedValueOnce(new Error('An error occurred'));

    render(
      <Router>
        <Main />
      </Router>
    );

    const errorMessage = await screen.findByText(
      /An error occurred/i,
      {},
      { timeout: 2000 }
    );
    expect(errorMessage).toBeTruthy();
  });
});
