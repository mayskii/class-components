import { render, screen } from '@testing-library/react';
import App from '../../../pages/_app';
import '@testing-library/jest-dom';
import { Router } from 'next/router';
import { AppProps } from 'next/app';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  })),
}));

const MockComponent = ({ text }: { text: string }) => <p>{text}</p>;

describe('App Component (_app.tsx)', () => {
  test('Render app with Redux, ThemeProvider и ErrorBoundary', () => {
    const mockRouter = {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    } as Router;

    const appProps: AppProps = {
      Component: MockComponent,
      pageProps: { text: 'Hello, Next.js!' },
      router: mockRouter,
    };

    render(<App {...appProps} />);

    expect(screen.getByText('Hello, Next.js!')).toBeInTheDocument();
  });

  test('Catch errors with ErrorBoundary', () => {
    const ErrorThrowingComponent = () => {
      throw new Error('Test Error');
    };

    const mockRouter = {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    } as Router;

    const appProps: AppProps = {
      Component: ErrorThrowingComponent,
      pageProps: {},
      router: mockRouter,
    };

    render(<App {...appProps} />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
