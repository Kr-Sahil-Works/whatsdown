'use client';

import * as React from 'react';

type AnyProps = Record<string, any>;

export function Highlight({
  children,
}: {
  children: React.ReactNode;
} & AnyProps) {
  return <>{children}</>;
}

export function HighlightItem({
  children,
}: {
  children: React.ReactNode;
  activeClassName?: string;
} & AnyProps) {
  return <>{children}</>;
}
