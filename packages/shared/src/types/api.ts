import type { EntityRecord, EntityType } from './entity.js';

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export interface ResponseMeta {
  requestId: string;
  took: number;
}

export interface ListResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  meta: ResponseMeta;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface HealthResponse {
  status: 'ok';
  recordCounts: Record<EntityType, number>;
}

export interface StatsResponse {
  total: number;
  byStatus: Record<string, number>;
}

export type ListQueryResult<T extends EntityRecord = EntityRecord> = ListResponse<T>;
