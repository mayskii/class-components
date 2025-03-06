import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeProvider';
import { ThemeContext } from '../context/ThemeContext';

describe('ThemeProvider', () => {
  test('должен иметь тему "dark" по умолчанию', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(context) => <div data-testid="theme">{context?.theme}</div>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(getByTestId('theme').textContent).toBe('dark');
  });

  test('должен переключать тему с "dark" на "light" и обратно', () => {
    const { getByTestId, getByRole } = render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(context) => (
            <div>
              <div data-testid="theme">{context?.theme}</div>
              <button onClick={context?.toggleTheme}>Toggle Theme</button>
            </div>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    const themeDiv = getByTestId('theme');
    const toggleButton = getByRole('button', { name: /toggle theme/i });

    expect(themeDiv.textContent).toBe('dark');

    fireEvent.click(toggleButton);
    expect(themeDiv.textContent).toBe('light');

    fireEvent.click(toggleButton);
    expect(themeDiv.textContent).toBe('dark');
  });
});
