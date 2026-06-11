import { ENTITY_FIELD_META } from '@mde/shared';

import type { EntityRecord, EntityType } from '../types/index.js';

export function applySearch(
  records: EntityRecord[],
  entity: EntityType,
  search?: string,
): EntityRecord[] {
  if (!search || search.trim() === '') return records;

  const query = search.trim().toLowerCase();
  const searchableFields = ENTITY_FIELD_META[entity].fields
    .filter((f) => f.searchable)
    .map((f) => f.key);

  return records.filter((record) =>
    searchableFields.some((field) => {
      const value = (record as unknown as Record<string, unknown>)[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(query);
    }),
  );
}
