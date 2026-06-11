import type { EntityType } from '@mde/shared';
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import { touchConceptActivity } from '@/features/concepts/utils/conceptActivity';
import { API_BASE_URL } from '@/shared/constants/config';
import type { AppDispatch } from '@/store';

import { DATA_TAGS } from './tags';

export interface PerformanceMetrics {
  requestCount: number;
  cacheHits: number;
  networkRequests: number;
  totalLatency: number;
  latencies: number[];
}

export const performanceMetrics: PerformanceMetrics = {
  requestCount: 0,
  cacheHits: 0,
  networkRequests: 0,
  totalLatency: 0,
  latencies: [],
};

const entityTagMap: Record<EntityType, string> = {
  users: DATA_TAGS.Users,
  orders: DATA_TAGS.Orders,
  transactions: DATA_TAGS.Transactions,
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithRetry = retry(rawBaseQuery, {
  maxRetries: 2,
  retryCondition: (_error, _args, { attempt, baseQueryApi }) => {
    if (attempt > 0) {
      touchConceptActivity(baseQueryApi.dispatch as AppDispatch, 'autoRetry');
    }
    return attempt <= 2;
  },
});

function isAutoRetryEnabled(api: { getState: () => unknown }): boolean {
  const state = api.getState() as {
    conceptControls?: { enabled?: Partial<Record<string, boolean>> };
  };
  return state.conceptControls?.enabled?.autoRetry ?? true;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const start = performance.now();
    const executor = isAutoRetryEnabled(api) ? baseQueryWithRetry : rawBaseQuery;
    const result = await executor(args, api, extraOptions);

    const latency = performance.now() - start;
    performanceMetrics.requestCount++;
    performanceMetrics.totalLatency += latency;
    performanceMetrics.latencies.push(latency);
    if (performanceMetrics.latencies.length > 100) {
      performanceMetrics.latencies.shift();
    }

    if (result.meta?.response) {
      performanceMetrics.networkRequests++;
    }

    return result;
  },
  tagTypes: Object.values(DATA_TAGS),
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 30,
  refetchOnReconnect: true,
  refetchOnFocus: true,
  endpoints: () => ({}),
});

export function getEntityListTag(entity: EntityType): string {
  return entityTagMap[entity];
}
