import type { EntityType, FilterAst } from '@mde/shared';

import { MAX_SAVED_FILTERS } from '@/shared/constants/config';

import { db, type SavedFilterDoc } from './db';

export async function saveFilterToDb(
  name: string,
  filter: FilterAst,
  entity: EntityType,
): Promise<SavedFilterDoc> {
  const doc = {
    name,
    filter,
    entity,
    createdAt: new Date().toISOString(),
  };
  const id = await db.savedFilters.add(doc);
  const count = await db.savedFilters.count();
  if (count > MAX_SAVED_FILTERS) {
    const oldest = await db.savedFilters.orderBy('createdAt').limit(count - MAX_SAVED_FILTERS).toArray();
    await db.savedFilters.bulkDelete(oldest.map((e) => e.id!));
  }
  return { ...doc, id };
}

export async function getSavedFiltersFromDb(entity?: EntityType): Promise<SavedFilterDoc[]> {
  if (entity) {
    return db.savedFilters.where('entity').equals(entity).reverse().sortBy('createdAt');
  }
  return db.savedFilters.orderBy('createdAt').reverse().toArray();
}

export async function deleteSavedFilterFromDb(id: number): Promise<void> {
  await db.savedFilters.delete(id);
}
