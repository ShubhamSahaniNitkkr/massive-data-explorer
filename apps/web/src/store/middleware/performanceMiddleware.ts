import type { Middleware } from '@reduxjs/toolkit';

import { performanceMetrics } from '../api/baseApi';

export const performanceMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof action.type === 'string' &&
    action.type.endsWith('/executeQuery/fulfilled')
  ) {
    const meta = (action as { meta?: { arg?: { originalArgs?: unknown }; baseQueryMeta?: unknown } }).meta;
    if (meta?.baseQueryMeta === undefined) {
      performanceMetrics.cacheHits++;
    }
  }

  return result;
};
