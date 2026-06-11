import { describe, expect, it } from 'vitest';

import { parseSortParam, serializeSortParam } from '../src/schemas/query.schema.js';

describe('parseSortParam', () => {
  it('parses single column sort', () => {
    expect(parseSortParam('name:asc')).toEqual([{ field: 'name', direction: 'asc' }]);
  });

  it('parses multi-column sort', () => {
    expect(parseSortParam('createdAt:desc,name:asc')).toEqual([
      { field: 'createdAt', direction: 'desc' },
      { field: 'name', direction: 'asc' },
    ]);
  });

  it('defaults direction to asc', () => {
    expect(parseSortParam('email')).toEqual([{ field: 'email', direction: 'asc' }]);
  });

  it('returns empty array for undefined', () => {
    expect(parseSortParam(undefined)).toEqual([]);
  });
});

describe('serializeSortParam', () => {
  it('serializes sort columns', () => {
    expect(
      serializeSortParam([
        { field: 'createdAt', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ]),
    ).toBe('createdAt:desc,name:asc');
  });
});
