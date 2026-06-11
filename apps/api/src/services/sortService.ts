import type { SortColumn } from '@mde/shared';
import { ENTITY_FIELD_META } from '@mde/shared';

import type { EntityRecord, EntityType } from '../types/index.js';

function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  const multiplier = direction === 'asc' ? 1 : -1;

  if (a === null || a === undefined) return multiplier;
  if (b === null || b === undefined) return -multiplier;

  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * multiplier;
  }

  const aStr = String(a);
  const bStr = String(b);

  const aDate = Date.parse(aStr);
  const bDate = Date.parse(bStr);
  if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
    return (aDate - bDate) * multiplier;
  }

  return aStr.localeCompare(bStr) * multiplier;
}

export function applySort(
  records: EntityRecord[],
  entity: EntityType,
  sortColumns: SortColumn[],
): EntityRecord[] {
  if (sortColumns.length === 0) return records;

  const validFields = new Set(ENTITY_FIELD_META[entity].fields.filter((f) => f.sortable).map((f) => f.key));
  const columns = sortColumns.filter((c) => validFields.has(c.field));

  if (columns.length === 0) return records;

  return [...records].sort((a, b) => {
    for (const column of columns) {
      const aVal = (a as unknown as Record<string, unknown>)[column.field];
      const bVal = (b as unknown as Record<string, unknown>)[column.field];
      const result = compareValues(aVal, bVal, column.direction);
      if (result !== 0) return result;
    }
    return 0;
  });
}
