import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { ThemeProvider } from '../context/ThemeProvider';

describe('Pagination', () => {
  test('renders correctly with basic props', () => {
    const { getByText, getByRole } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Pagination currentPage={1} totalPages={5} />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Page 1 of 5')).toBeTruthy();
    expect(getByRole('spinbutton')).toBeTruthy();
  });

  test('displays Prev button only when currentPage > 1', () => {
    const { queryByText } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Pagination currentPage={1} totalPages={5} />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(queryByText('Previous')).toBeNull();

    const { queryByText: queryByText2 } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Pagination currentPage={2} totalPages={5} />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(queryByText2('Previous')).toBeTruthy();
  });

  test('should not change page if input value is greater than totalPages', () => {
    const { getByRole, getByText } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Pagination currentPage={2} totalPages={5} />
        </ThemeProvider>
      </MemoryRouter>
    );

    const input = getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.blur(input);

    expect(getByText('Page 2 of 5')).toBeTruthy();
  });

  test('should not change page if input value is less than 1', () => {
    const { getByRole, getByText } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Pagination currentPage={2} totalPages={5} />
        </ThemeProvider>
      </MemoryRouter>
    );

    const input = getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '-1' } });
    fireEvent.blur(input);

    expect(getByText('Page 2 of 5')).toBeTruthy();
  });

  test('should call onPageChange when Next button is clicked', () => {
    const onPageChangeMock = jest.fn();

    const { getByText } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Pagination
            currentPage={2}
            totalPages={5}
            onPageChange={onPageChangeMock}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    const nextButton = getByText('Next');
    fireEvent.click(nextButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });
});
