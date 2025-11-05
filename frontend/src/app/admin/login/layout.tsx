'use client';

import React from 'react';

// This layout overrides the parent admin layout
// to show login page without sidebar/header
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render just the children without any admin layout wrapper
  return <div className="min-h-screen">{children}</div>;
}
