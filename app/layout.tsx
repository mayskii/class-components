import React from 'react';
import ClientLayout from './ClientLayout';

import '../styles/App.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientLayout>{children}</ClientLayout>{' '}
      </body>
    </html>
  );
}
