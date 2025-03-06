import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../../components/Search';
import { ThemeProvider } from '../context/ThemeProvider';

const mockOnSearch = jest.fn();

describe('Search component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockOnSearch.mockClear();
  });

  test('renders search input and button', () => {
    render(
      <ThemeProvider>
        {' '}
        <Search onSearch={mockOnSearch} />
      </ThemeProvider>
    );

    expect(
      screen.getByPlaceholderText('Enter search term')
    ).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('does not call onSearch when input is empty', () => {
    render(
      <ThemeProvider>
        {' '}
        <Search onSearch={mockOnSearch} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Search'));
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('restores searchTerm from localStorage on render', () => {
    localStorage.setItem('searchTerm', 'Bulbasaur');
    render(
      <ThemeProvider>
        <Search onSearch={mockOnSearch} />
      </ThemeProvider>
    );
    expect(screen.getByPlaceholderText('Enter search term')).toHaveValue(
      'Bulbasaur'
    );
  });

  test('calls onSearch when searchTerm is not empty', () => {
    render(
      <ThemeProvider>
        <Search onSearch={mockOnSearch} />
      </ThemeProvider>
    );
    fireEvent.change(screen.getByPlaceholderText('Enter search term'), {
      target: { value: 'pikachu' },
    });
    fireEvent.click(screen.getByText('Search'));
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });
});
