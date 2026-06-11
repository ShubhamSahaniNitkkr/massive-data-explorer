import type { EntityRecord, EntityType } from '@mde/shared';

import { createSeedData } from '../data/seed.js';
import type { DataStore } from '../types/index.js';

let store: DataStore | null = null;

export function getDataStore(): DataStore {
  if (!store) {
    store = createSeedData();
  }
  return store;
}

export function getEntityCollection(entity: EntityType): EntityRecord[] {
  const data = getDataStore();
  switch (entity) {
    case 'users':
      return data.users;
    case 'orders':
      return data.orders;
    case 'transactions':
      return data.transactions;
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unknown entity: ${exhaustive}`);
    }
  }
}

export function getRecordCounts(): Record<EntityType, number> {
  const data = getDataStore();
  return {
    users: data.users.length,
    orders: data.orders.length,
    transactions: data.transactions.length,
  };
}

export function resetDataStoreForTests(): void {
  store = null;
}
