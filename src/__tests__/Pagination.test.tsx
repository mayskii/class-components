import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import Pagination from '../../components/Pagination';
import { ThemeProvider } from '../context/ThemeProvider';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Pagination', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test('renders correctly with basic props', () => {
    render(
      <ThemeProvider>
        <Pagination currentPage={1} totalPages={5} />
      </ThemeProvider>
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  test('displays Prev button only when currentPage > 1', () => {
    const { queryByText } = render(
      <ThemeProvider>
        <Pagination currentPage={1} totalPages={5} />
      </ThemeProvider>
    );
    expect(queryByText('Previous')).not.toBeInTheDocument();

    const { queryByText: queryByText2 } = render(
      <ThemeProvider>
        <Pagination currentPage={2} totalPages={5} />
      </ThemeProvider>
    );
    expect(queryByText2('Previous')).toBeInTheDocument();
  });

  test('should not change page if input value is greater than totalPages', () => {
    render(
      <ThemeProvider>
        <Pagination currentPage={2} totalPages={5} />
      </ThemeProvider>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.blur(input);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  test('should not change page if input value is less than 1', () => {
    render(
      <ThemeProvider>
        <Pagination currentPage={2} totalPages={5} />
      </ThemeProvider>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '-1' } });
    fireEvent.blur(input);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  test('should call onPageChange when Next button is clicked', () => {
    const onPageChangeMock = jest.fn();

    render(
      <ThemeProvider>
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={onPageChangeMock}
        />
      </ThemeProvider>
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(3);
    expect(mockPush).toHaveBeenCalledWith('?page=3');
  });
});
