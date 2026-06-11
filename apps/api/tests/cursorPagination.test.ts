import type { User } from '@mde/shared';
import { describe, expect, it } from 'vitest';

import { decodeCursor, encodeCursor, paginateRecords } from '../src/services/cursorPagination.js';

const mockRecords: User[] = Array.from({ length: 100 }, (_, i) => ({
  id: `usr_${String(i).padStart(4, '0')}`,
  email: `user${i}@example.com`,
  name: `User ${i}`,
  role: 'analyst',
  department: 'Engineering',
  status: 'active',
  createdAt: new Date(2024, 0, i + 1).toISOString(),
  lastLoginAt: new Date(2025, 0, i + 1).toISOString(),
  country: 'US',
}));

describe('cursorPagination', () => {
  it('returns first page', () => {
    const result = paginateRecords(mockRecords, 10);
    expect(result.data).toHaveLength(10);
    expect(result.pagination.hasMore).toBe(true);
    expect(result.pagination.total).toBe(100);
    expect(result.pagination.nextCursor).toBeTruthy();
  });

  it('returns next page with cursor', () => {
    const first = paginateRecords(mockRecords, 10);
    const second = paginateRecords(mockRecords, 10, first.pagination.nextCursor!);
    expect(second.data).toHaveLength(10);
    expect(second.data[0].id).toBe('usr_0010');
  });

  it('encodes and decodes cursor', () => {
    const payload = { index: 9, sortField: 'id', sortValue: 'usr_0009' };
    const encoded = encodeCursor(payload);
    expect(decodeCursor(encoded)).toEqual(payload);
  });

  it('returns no more pages at end', () => {
    let cursor: string | undefined;
    let hasMore = true;
    let pages = 0;

    while (hasMore) {
      const result = paginateRecords(mockRecords, 25, cursor);
      cursor = result.pagination.nextCursor ?? undefined;
      hasMore = result.pagination.hasMore;
      pages++;
    }

    expect(pages).toBe(4);
  });
});
