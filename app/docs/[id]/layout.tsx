'use client';

import { MyRuntimeProvider } from './MyRuntimeProvider';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MyRuntimeProvider>{children}</MyRuntimeProvider>;
} 