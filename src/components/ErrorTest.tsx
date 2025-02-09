import React from 'react';

const ErrorTest: React.FC = () => {
  throw new Error('This is a test error from ErrorTest!');
  return null;
};

export default ErrorTest;
