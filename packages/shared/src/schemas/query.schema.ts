import { z } from 'zod';

import { filterAstSchema } from './filter.schema.js';

export const listQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  sort: z.string().optional(),
  search: z.string().optional(),
  filter: z.string().optional(),
  simulateLatency: z.coerce.number().int().min(0).max(5000).optional(),
});

export type ListQueryParams = z.infer<typeof listQuerySchema>;

export interface SortColumn {
  field: string;
  direction: 'asc' | 'desc';
}

export function parseSortParam(sort?: string): SortColumn[] {
  if (!sort) return [];
  return sort
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [field, direction = 'asc'] = part.split(':');
      return {
        field: field.trim(),
        direction: direction.trim() === 'desc' ? 'desc' : 'asc',
      } as SortColumn;
    });
}

export function serializeSortParam(columns: SortColumn[]): string {
  return columns.map((c) => `${c.field}:${c.direction}`).join(',');
}

export function parseFilterParam(filter?: string) {
  if (!filter) return null;
  try {
    const parsed = JSON.parse(filter) as unknown;
    const result = filterAstSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
