import type { EntityType } from '@mde/shared';

import { MAX_SEARCH_HISTORY } from '@/shared/constants/config';

import { db, type SearchHistoryEntry } from './db';

export async function addSearchHistory(query: string, entity: EntityType): Promise<void> {
  if (!query.trim()) return;

  const existing = await db.searchHistory.where('query').equals(query.trim()).first();
  if (existing?.id) {
    await db.searchHistory.update(existing.id, {
      timestamp: new Date().toISOString(),
      entity,
    });
  } else {
    await db.searchHistory.add({
      query: query.trim(),
      timestamp: new Date().toISOString(),
      entity,
    });
  }

  const count = await db.searchHistory.count();
  if (count > MAX_SEARCH_HISTORY) {
    const oldest = await db.searchHistory.orderBy('timestamp').limit(count - MAX_SEARCH_HISTORY).toArray();
    await db.searchHistory.bulkDelete(oldest.map((e) => e.id!));
  }
}

export async function getSearchHistory(limit = 10): Promise<SearchHistoryEntry[]> {
  return db.searchHistory.orderBy('timestamp').reverse().limit(limit).toArray();
}

export async function clearSearchHistory(): Promise<void> {
  await db.searchHistory.clear();
}
