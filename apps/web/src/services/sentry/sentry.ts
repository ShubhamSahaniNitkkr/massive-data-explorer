import * as Sentry from '@sentry/react';

import { SENTRY_DSN } from '@/shared/constants/config';

let initialized = false;

export function initSentry(): void {
  if (initialized || !SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE,
  });

  initialized = true;
}

export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (!initialized) {
    console.error('[Sentry not configured]', error, context);
    return;
  }
  Sentry.captureException(error, { extra: context });
}

export { Sentry };
