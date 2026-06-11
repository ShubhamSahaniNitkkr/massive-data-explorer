import type { EntityRecord, EntityType, ListResponse } from '@mde/shared';
import { parseFilterParam, parseSortParam } from '@mde/shared';
import { v4 as uuidv4 } from 'uuid';

import type { ListOptions } from '../types/index.js';

import { paginateRecords } from './cursorPagination.js';
import { getEntityCollection } from './dataStore.js';
import { applyFilters } from './filterService.js';
import { applySearch } from './searchService.js';
import { applySort } from './sortService.js';

export async function listEntities(options: ListOptions): Promise<ListResponse<EntityRecord>> {
  const start = Date.now();
  const { entity, cursor, limit = 50, sort, search, filter } = options;

  let records = getEntityCollection(entity);
  const filterAst = parseFilterParam(filter);
  const sortColumns = parseSortParam(sort);

  records = applySearch(records, entity, search);
  records = applyFilters(records, entity, filterAst);
  records = applySort(records, entity, sortColumns);

  const { data, pagination } = paginateRecords(records, limit, cursor, sortColumns);

  return {
    data,
    pagination,
    meta: {
      requestId: uuidv4(),
      took: Date.now() - start,
    },
  };
}

export function getEntityById(entity: EntityType, id: string): EntityRecord | undefined {
  return getEntityCollection(entity).find((r) => r.id === id);
}

export function getEntityStats(entity: EntityType): { total: number; byStatus: Record<string, number> } {
  const records = getEntityCollection(entity);
  const byStatus: Record<string, number> = {};

  for (const record of records) {
    const status = String((record as unknown as Record<string, unknown>).status ?? 'unknown');
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }

  return { total: records.length, byStatus };
}
