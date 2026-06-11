import type { EntityRecord, EntityType } from '@mde/shared';
import { useEffect, useMemo, useRef } from 'react';

import { bumpCacheBust } from '@/features/concepts/store/conceptControlsSlice';
import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';
import { touchConceptActivity } from '@/features/concepts/utils/conceptActivity';
import { buildListQueryArg, dataApi, useGetEntityListInfiniteQuery } from '@/store/api/dataApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

export function useInfiniteData(entity: EntityType) {
  const dispatch = useAppDispatch();
  const debouncedQuery = useAppSelector((state) => state.searchUi.debouncedQuery);
  const sortColumns = useAppSelector((state) => state.sortingUi.sortColumns);
  const activeFilter = useAppSelector((state) => state.filtersUi.activeFilter);
  const pageSize = useAppSelector((state) => state.preferences.defaultPageSize);
  const cacheEnabled = useConceptEnabled('rtkQueryCache');
  const prefetchEnabled = useConceptEnabled('prefetching');
  const keepPreviousEnabled = useConceptEnabled('keepPreviousData');
  const cacheBust = useAppSelector((state) => state.conceptControls.cacheBust);
  const previousDataRef = useRef<EntityRecord[]>([]);
  const prefetchEntityList = dataApi.usePrefetch('getEntityList');

  useEffect(() => {
    if (!cacheEnabled) {
      dispatch(bumpCacheBust());
    }
  }, [entity, debouncedQuery, sortColumns, activeFilter, cacheEnabled, dispatch]);

  const queryArg = useMemo(
    () => ({
      ...buildListQueryArg(entity, {
        limit: pageSize,
        sort: sortColumns,
        search: debouncedQuery || undefined,
        filter: activeFilter ? JSON.stringify(activeFilter) : undefined,
      }),
      ...(cacheEnabled ? {} : { _cacheBust: cacheBust }),
    }),
    [entity, pageSize, sortColumns, debouncedQuery, activeFilter, cacheEnabled, cacheBust],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetEntityListInfiniteQuery(queryArg);

  const flatData = useMemo<EntityRecord[]>(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  useEffect(() => {
    if (flatData.length > 0) {
      previousDataRef.current = flatData;
    }
  }, [flatData]);

  const displayData = useMemo<EntityRecord[]>(() => {
    if (
      keepPreviousEnabled &&
      isFetching &&
      !isLoading &&
      flatData.length === 0 &&
      previousDataRef.current.length > 0
    ) {
      return previousDataRef.current;
    }
    return flatData;
  }, [flatData, keepPreviousEnabled, isFetching, isLoading]);

  useEffect(() => {
    if (
      keepPreviousEnabled &&
      isFetching &&
      !isLoading &&
      flatData.length === 0 &&
      previousDataRef.current.length > 0
    ) {
      touchConceptActivity(dispatch, 'keepPreviousData');
    }
  }, [keepPreviousEnabled, isFetching, isLoading, flatData.length, dispatch]);

  useEffect(() => {
    if (!prefetchEnabled || !hasNextPage || isFetchingNextPage || isLoading) return;
    if (!data?.pages || data.pages.length < 2) return;

    touchConceptActivity(dispatch, 'prefetching');
    prefetchEntityList(queryArg);
  }, [
    prefetchEnabled,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    data?.pages,
    queryArg,
    prefetchEntityList,
    dispatch,
  ]);

  const total = data?.pages[0]?.pagination.total ?? 0;

  useEffect(() => {
    if (isFetching && cacheEnabled) {
      touchConceptActivity(dispatch, 'rtkQueryCache');
    }
  }, [isFetching, cacheEnabled, dispatch]);

  useEffect(() => {
    if (isFetchingNextPage) {
      touchConceptActivity(dispatch, 'infiniteScroll');
    }
  }, [isFetchingNextPage, dispatch]);

  return {
    data: displayData,
    total,
    isLoading,
    isFetching,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    showingStaleData:
      keepPreviousEnabled &&
      isFetching &&
      !isLoading &&
      flatData.length === 0 &&
      previousDataRef.current.length > 0,
  };
}
