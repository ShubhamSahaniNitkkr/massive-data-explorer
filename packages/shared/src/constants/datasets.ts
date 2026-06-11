import type { EntityType } from '../types/entity.js';

export const ENTITY_TYPES: EntityType[] = ['users', 'orders', 'transactions'];

export const ENTITY_LABELS: Record<EntityType, string> = {
  users: 'Users',
  orders: 'Orders',
  transactions: 'Transactions',
};

export const DEFAULT_PAGE_SIZE = 100;
export const MAX_PAGE_SIZE = 200;
export const SEARCH_DEBOUNCE_MS = 300;

export const RECORD_COUNTS = {
  users: 272_727,
  orders: 363_636,
  transactions: 363_637,
} as const;

/** 10 lakh (1,000,000) total records across all entities */
export const TOTAL_RECORD_COUNT =
  RECORD_COUNTS.users + RECORD_COUNTS.orders + RECORD_COUNTS.transactions;
