import { RECORD_COUNTS } from '@mde/shared';

import { env } from './env.js';

export function getScaledRecordCounts(): Record<'users' | 'orders' | 'transactions', number> {
  const scale = env.RECORD_COUNT_SCALE;
  return {
    users: Math.max(1, Math.round(RECORD_COUNTS.users * scale)),
    orders: Math.max(1, Math.round(RECORD_COUNTS.orders * scale)),
    transactions: Math.max(1, Math.round(RECORD_COUNTS.transactions * scale)),
  };
}

export function getScaledTotalRecordCount(): number {
  const counts = getScaledRecordCounts();
  return counts.users + counts.orders + counts.transactions;
}
