import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeProvider';
import { ThemeContext } from '../context/ThemeContext';

describe('ThemeProvider Component', () => {
  test('should have dark theme by default', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(context) => {
            if (!context) return null;
            return <div>{context.theme}</div>;
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    const themeDiv = container.querySelector('div');
    expect(themeDiv?.textContent).toBe('dark');
  });

  test('should toggle theme to light', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(context) => {
            if (!context) return null;
            return (
              <div>
                <div>{context.theme}</div>
                <button onClick={context.toggleTheme}>Toggle Theme</button>
              </div>
            );
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    const themeDiv = container.querySelector('div');
    expect(themeDiv?.textContent).toBe('darkToggle Theme');

    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    expect(themeDiv?.textContent).toBe('lightToggle Theme');
  });

  test('should toggle theme back to dark', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(context) => {
            if (!context) return null;
            return (
              <div>
                <div>{context.theme}</div>
                <button onClick={context.toggleTheme}>Toggle Theme</button>
              </div>
            );
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    const themeDiv = container.querySelector('div');
    expect(themeDiv?.textContent).toBe('darkToggle Theme');

    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    expect(themeDiv?.textContent).toBe('lightToggle Theme');

    if (button) {
      fireEvent.click(button);
    }

    expect(themeDiv?.textContent).toBe('darkToggle Theme');
  });
});
