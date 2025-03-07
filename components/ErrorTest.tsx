'use client';

import React from 'react';

const ErrorTest: React.FC = () => {
  throw new Error('This is a test error from ErrorTest!');
};

export default ErrorTest;
