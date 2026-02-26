'use client';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React, { type ReactNode } from 'react';

const apiKey = process.env.NEXT_PUBLIC_BUGSNAG_API_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let BugsnagErrorBoundary: React.ComponentType<any> | null = null;

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && apiKey) {
  Bugsnag.start({
    apiKey,
    plugins: [new BugsnagPluginReact()],
    releaseStage: process.env.NODE_ENV,
  });
  BugsnagErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);
}

export function BugsnagProvider({ children }: { children: ReactNode }) {
  if (!BugsnagErrorBoundary) {
    return <>{children}</>;
  }
  return <BugsnagErrorBoundary>{children}</BugsnagErrorBoundary>;
}
