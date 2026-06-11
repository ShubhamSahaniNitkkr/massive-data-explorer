import type {
  EntityMeta,
  EntityRecord,
  EntityType,
  HealthResponse,
  ListResponse,
  StatsResponse,
} from '@mde/shared';
import { serializeSortParam } from '@mde/shared';

import { baseApi, getEntityListTag } from './baseApi';
import { DATA_TAGS, type DataTag } from './tags';

export interface ListQueryArg {
  entity: EntityType;
  cursor?: string;
  limit?: number;
  sort?: string;
  search?: string;
  filter?: string;
  _cacheBust?: number;
}

export interface InfiniteListData {
  pages: ListResponse<EntityRecord>[];
  pageParams: (string | undefined)[];
}

export const dataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => '/health',
    }),

    getEntityFields: builder.query<{ data: EntityMeta }, EntityType>({
      query: (entity) => `/meta/fields/${entity}`,
    }),

    getEntityStats: builder.query<{ data: StatsResponse }, EntityType>({
      query: (entity) => `/${entity}/stats`,
      providesTags: (_result, _error, entity) => [
        { type: getEntityListTag(entity) as DataTag, id: 'STATS' },
      ],
    }),

    getEntityList: builder.infiniteQuery<ListResponse<EntityRecord>, ListQueryArg, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) =>
          lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
      },
      query: ({ queryArg, pageParam }) => {
        const params = new URLSearchParams();
        if (pageParam) params.set('cursor', pageParam);
        if (queryArg.limit) params.set('limit', String(queryArg.limit));
        if (queryArg.sort) params.set('sort', queryArg.sort);
        if (queryArg.search) params.set('search', queryArg.search);
        if (queryArg.filter) params.set('filter', queryArg.filter);
        params.set('simulateLatency', '0');
        const qs = params.toString();
        return `/${queryArg.entity}${qs ? `?${qs}` : ''}`;
      },
      providesTags: (_result, _error, arg) => [
        { type: getEntityListTag(arg.entity) as DataTag, id: 'LIST' },
      ],
      serializeQueryArgs: ({ queryArgs }) => {
        const { entity, limit, sort, search, filter, _cacheBust } = queryArgs;
        const base = `${entity}-${limit ?? 50}-${sort ?? ''}-${search ?? ''}-${filter ?? ''}`;
        return _cacheBust !== undefined ? `${base}-bust:${_cacheBust}` : base;
      },
    }),

    getEntityById: builder.query<{ data: EntityRecord }, { entity: EntityType; id: string }>({
      query: ({ entity, id }) => `/${entity}/${id}`,
      providesTags: (_result, _error, { entity, id }) => [
        { type: getEntityListTag(entity) as DataTag, id },
      ],
    }),
  }),
});

export const {
  useGetHealthQuery,
  useGetEntityFieldsQuery,
  useGetEntityStatsQuery,
  useGetEntityListInfiniteQuery,
  useGetEntityByIdQuery,
} = dataApi;

export function buildListQueryArg(
  entity: EntityType,
  options: {
    limit?: number;
    sort?: { field: string; direction: 'asc' | 'desc' }[];
    search?: string;
    filter?: string;
  },
): ListQueryArg {
  return {
    entity,
    limit: options.limit,
    sort: options.sort?.length ? serializeSortParam(options.sort) : undefined,
    search: options.search || undefined,
    filter: options.filter || undefined,
  };
}
