import type { Middleware } from '@reduxjs/toolkit';

import { captureException } from '@/services/sentry/sentry';

export const sentryMiddleware: Middleware = () => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    captureException(error as Error, { action: String((action as { type?: string }).type) });
    throw error;
  }
};
