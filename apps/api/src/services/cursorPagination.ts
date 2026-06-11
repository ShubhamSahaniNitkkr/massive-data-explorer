import type { EntityRecord, PaginationMeta, SortColumn } from '@mde/shared';

export interface CursorPayload {
  index: number;
  sortField: string;
  sortValue: string | number | null;
}

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function decodeCursor(cursor: string): CursorPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8')) as CursorPayload;
    if (typeof parsed.index !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function paginateRecords(
  records: EntityRecord[],
  limit: number,
  cursor?: string,
  sortColumns: SortColumn[] = [],
): { data: EntityRecord[]; pagination: PaginationMeta } {
  const total = records.length;
  let startIndex = 0;

  if (cursor) {
    const decoded = decodeCursor(cursor);
    if (decoded) {
      startIndex = Math.min(decoded.index + 1, total);
    }
  }

  const data = records.slice(startIndex, startIndex + limit);
  const endIndex = startIndex + data.length - 1;
  const hasMore = startIndex + limit < total;

  const primarySort = sortColumns[0];
  const lastRecord = data[data.length - 1];
  const sortValue = primarySort && lastRecord
    ? ((lastRecord as unknown as Record<string, unknown>)[primarySort.field] as string | number | null)
    : null;

  return {
    data,
    pagination: {
      nextCursor: hasMore && lastRecord
        ? encodeCursor({
            index: endIndex,
            sortField: primarySort?.field ?? 'id',
            sortValue,
          })
        : null,
      hasMore,
      total,
    },
  };
}
