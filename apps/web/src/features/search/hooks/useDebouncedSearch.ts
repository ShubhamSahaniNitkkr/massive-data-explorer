import { useEffect, useRef } from 'react';

import {
  extractSearchTerms,
  extractTermsWithMainThreadBlock,
} from '@/features/concepts/utils/extractTerms';
import { incrementApiCalls } from '@/features/concepts/store/conceptControlsSlice';
import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';
import { touchConceptActivity } from '@/features/concepts/utils/conceptActivity';
import { setDebouncedQuery, setSearchQuery } from '@/features/search/store/searchUiSlice';
import { addSearchHistory } from '@/services/indexeddb/searchHistoryRepo';
import { SEARCH_DEBOUNCE_MS } from '@/shared/constants/config';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';
import { runSearchWorker } from '@/workers/workerPool';

export function useDebouncedSearch(entity: string) {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.searchUi.query);
  const debouncedQuery = useAppSelector((state) => state.searchUi.debouncedQuery);
  const debouncingEnabled = useConceptEnabled('debouncing');
  const abortEnabled = useConceptEnabled('abortController');
  const workersEnabled = useConceptEnabled('webWorkers');
  const indexedDBEnabled = useConceptEnabled('indexedDB');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (abortEnabled && abortRef.current) abortRef.current.abort();

    if (query && debouncingEnabled) {
      touchConceptActivity(dispatch, 'debouncing');
    }

    const delay = debouncingEnabled ? SEARCH_DEBOUNCE_MS : 0;

    const runSearch = async () => {
      if (abortEnabled) {
        abortRef.current = new AbortController();
        touchConceptActivity(dispatch, 'abortController');
      }
      const signal = abortRef.current?.signal;

      try {
        if (workersEnabled) {
          touchConceptActivity(dispatch, 'webWorkers');
          const result = await runSearchWorker({
            type: 'extractTerms',
            payload: { query },
          });
          if (signal?.aborted) return;
          if (result.type === 'terms') {
            dispatch(setDebouncedQuery(query));
            dispatch(incrementApiCalls());
            if (query.trim() && indexedDBEnabled) {
              touchConceptActivity(dispatch, 'indexedDB');
              await addSearchHistory(query, entity as 'users' | 'orders' | 'transactions');
            }
          }
        } else {
          extractTermsWithMainThreadBlock(query);
          if (signal?.aborted) return;
          extractSearchTerms(query);
          dispatch(setDebouncedQuery(query));
          dispatch(incrementApiCalls());
          if (query.trim() && indexedDBEnabled) {
            touchConceptActivity(dispatch, 'indexedDB');
            await addSearchHistory(query, entity as 'users' | 'orders' | 'transactions');
          }
        }
      } catch {
        if (!signal?.aborted) {
          dispatch(setDebouncedQuery(query));
          dispatch(incrementApiCalls());
        }
      }
    };

    if (delay === 0) {
      runSearch();
    } else {
      timeoutRef.current = setTimeout(runSearch, delay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortEnabled && abortRef.current) abortRef.current.abort();
    };
  }, [query, dispatch, entity, debouncingEnabled, abortEnabled, workersEnabled, indexedDBEnabled]);

  const setQuery = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  return { query, debouncedQuery, setQuery };
}
