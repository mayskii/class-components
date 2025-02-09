import { render } from '@testing-library/react';
import ErrorTest from '../components/ErrorTest';

describe('ErrorTest Component', () => {
  test('should throw an error', () => {
    expect(() => render(<ErrorTest />)).toThrow(
      'This is a test error from ErrorTest!'
    );
  });
});
