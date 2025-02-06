import { Component } from 'react';

class ErrorTest extends Component {
  render() {
    throw new Error('This is a test error from ErrorTest!');
    return null;
  }
}

export default ErrorTest;
