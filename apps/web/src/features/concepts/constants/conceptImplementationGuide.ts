import type { ConceptId } from './concepts';

export interface ConceptCodeReference {
  path: string;
  lines: string;
  note: string;
}

export interface ConceptImplementationGuide {
  /** Minimal pattern — what you'd ship in production */
  simplestImplementation: string;
  codeReferences: ConceptCodeReference[];
}

export const CONCEPT_IMPLEMENTATION_GUIDE: Record<ConceptId, ConceptImplementationGuide> = {
  virtualization: {
    simplestImplementation: `const virtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 44,
});
// Render only virtualizer.getVirtualItems() — not rows.map()`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '255-262',
        note: 'TanStack Virtual — mount ~30 visible rows',
      },
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '153, 388-421',
        note: 'Toggle + virtual row rendering vs full DOM map',
      },
    ],
  },
  debouncing: {
    simplestImplementation: `useEffect(() => {
  const id = setTimeout(() => setDebouncedQuery(query), 300);
  return () => clearTimeout(id);
}, [query]);`,
    codeReferences: [
      {
        path: 'apps/web/src/features/search/hooks/useDebouncedSearch.ts',
        lines: '27-35, 79-83',
        note: '300ms delay before search runs',
      },
      {
        path: 'apps/web/src/shared/constants/config.ts',
        lines: '3',
        note: 'SEARCH_DEBOUNCE_MS constant',
      },
    ],
  },
  abortController: {
    simplestImplementation: `const controller = new AbortController();
fetch(url, { signal: controller.signal });
// On new request: controller.abort() then create a new one`,
    codeReferences: [
      {
        path: 'apps/web/src/features/search/hooks/useDebouncedSearch.ts',
        lines: '25, 29, 38-42',
        note: 'Abort previous search on each keystroke',
      },
      {
        path: 'apps/web/src/shared/utils/debounce.ts',
        lines: '13-33',
        note: 'Reusable debounced + abortable helper',
      },
    ],
  },
  reactMemo: {
    simplestImplementation: `const Row = memo(function Row({ data }) {
  return <tr>{data.name}</tr>;
});`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '130, 172',
        note: 'TableRowMemo vs TableRowInner switch',
      },
      {
        path: 'apps/web/src/features/explorer/components/DataTable/AdaptiveDataTableHeader.tsx',
        lines: '8-11',
        note: 'Memoized header adapter',
      },
      {
        path: 'apps/web/src/features/search/components/AdaptiveSearchHighlight.tsx',
        lines: '12-14',
        note: 'Memoized search highlight',
      },
    ],
  },
  useCallback: {
    simplestImplementation: `const onSort = useCallback(
  (field) => dispatch(toggleSort(field)),
  [dispatch],
);`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '178-196, 307-308',
        note: 'Stable sort + row toggle handlers',
      },
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '210-217',
        note: 'Stable fetchNextPage handler',
      },
    ],
  },
  useMemo: {
    simplestImplementation: `const columns = useMemo(
  () => buildGridTemplate(visibleColumns),
  [visibleColumns],
);`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '310-321',
        note: 'Cached grid layout + table min width',
      },
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '283-286',
        note: 'Memoized throttled scroll handler factory',
      },
    ],
  },
  useTransition: {
    simplestImplementation: `const [pending, startTransition] = useTransition();
startTransition(() => dispatch(heavySortAction()));`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '178-184',
        note: 'Sort dispatch wrapped in startTransition',
      },
    ],
  },
  useDeferredValue: {
    simplestImplementation: `const deferredQuery = useDeferredValue(query);
// Use deferredQuery for expensive highlights, query for input`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '149, 164-170',
        note: 'Deferred value drives row highlights',
      },
    ],
  },
  throttling: {
    simplestImplementation: `const onScroll = throttle(() => handleScroll(), 200);
el.addEventListener('scroll', onScroll, { passive: true });`,
    codeReferences: [
      {
        path: 'apps/web/src/shared/utils/throttle.ts',
        lines: '1-29',
        note: 'Generic throttle utility',
      },
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '283-292',
        note: 'Applied to table scroll listener',
      },
    ],
  },
  codeSplitting: {
    simplestImplementation: `const Panel = lazy(() => import('./FilterPanel'));
// <Suspense><Panel /></Suspense>`,
    codeReferences: [
      {
        path: 'apps/web/src/features/filters/components/FilterPanelSlot.tsx',
        lines: '11-13, 32-43',
        note: 'React.lazy dynamic import',
      },
    ],
  },
  suspense: {
    simplestImplementation: `<Suspense fallback={<Spinner />}>
  <LazyPanel />
</Suspense>`,
    codeReferences: [
      {
        path: 'apps/web/src/features/filters/components/FilterPanelSlot.tsx',
        lines: '19-39',
        note: 'Loading fallback while chunk loads',
      },
    ],
  },
  webWorkers: {
    simplestImplementation: `const worker = new Worker(new URL('./worker.ts', import.meta.url));
worker.postMessage({ query });
worker.onmessage = (e) => setTerms(e.data);`,
    codeReferences: [
      {
        path: 'apps/web/src/workers/workerPool.ts',
        lines: '8-42',
        note: 'Worker pool + postMessage API',
      },
      {
        path: 'apps/web/src/features/search/hooks/useDebouncedSearch.ts',
        lines: '45-50',
        note: 'Search term extraction off main thread',
      },
    ],
  },
  rtkQueryCache: {
    simplestImplementation: `const { data } = useGetListQuery(arg);
// RTK Query caches by serializeQueryArgs key — revisit = instant`,
    codeReferences: [
      {
        path: 'apps/web/src/store/api/dataApi.ts',
        lines: '46-70',
        note: 'Infinite query + cache key serialization',
      },
      {
        path: 'apps/web/src/features/explorer/hooks/useInfiniteData.ts',
        lines: '16-27, 37-38',
        note: 'Cache bust when toggle OFF',
      },
    ],
  },
  prefetching: {
    simplestImplementation: `const prefetch = api.usePrefetch('getList');
useEffect(() => { if (hasMore) prefetch(arg); }, [hasMore]);`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/hooks/useInfiniteData.ts',
        lines: '21, 90-95',
        note: 'RTK Query prefetch next page',
      },
    ],
  },
  keepPreviousData: {
    simplestImplementation: `const prev = useRef(data);
if (isFetching && data.length === 0) return prev.current;
return data;`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/hooks/useInfiniteData.ts',
        lines: '20, 59-76',
        note: 'Stale rows while new query fetches',
      },
    ],
  },
  infiniteScroll: {
    simplestImplementation: `// Sentinel at list bottom → fetchNextPage()
const { fetchNextPage, hasNextPage } = useInfiniteQuery();`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '226-228, 448-450',
        note: 'Sentinel + infinite scroll toggle',
      },
      {
        path: 'apps/web/src/features/explorer/hooks/useInfiniteData.ts',
        lines: '42-52, 115-118',
        note: 'RTK infinite query hook',
      },
    ],
  },
  intersectionObserver: {
    simplestImplementation: `new IntersectionObserver(([e]) => {
  if (e.isIntersecting) loadMore();
}, { root: scrollContainer }).observe(sentinel);`,
    codeReferences: [
      {
        path: 'apps/web/src/features/explorer/hooks/useIntersectionLoadMore.ts',
        lines: '29-45',
        note: 'Observer with scroll container as root',
      },
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '219-228',
        note: 'Wired to table scroll ref',
      },
    ],
  },
  indexedDB: {
    simplestImplementation: `await db.searchHistory.put({ query, entity, timestamp });
const history = await db.searchHistory.orderBy('timestamp').reverse().limit(8);`,
    codeReferences: [
      {
        path: 'apps/web/src/features/search/hooks/useDebouncedSearch.ts',
        lines: '55-57, 66-68',
        note: 'Persist search on debounce',
      },
      {
        path: 'apps/web/src/features/search/components/SearchHistoryDropdown.tsx',
        lines: '16-19',
        note: 'Live query from Dexie',
      },
      {
        path: 'apps/web/src/services/indexeddb/db.ts',
        lines: '38-56',
        note: 'Dexie schema + tables',
      },
    ],
  },
  errorBoundary: {
    simplestImplementation: `class Boundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <Fallback /> : this.props.children; }
}`,
    codeReferences: [
      {
        path: 'apps/web/src/shared/components/ui/FeatureErrorBoundary.tsx',
        lines: '14-55',
        note: 'Feature-level error boundary',
      },
      {
        path: 'apps/web/src/features/explorer/components/ExplorerPage.tsx',
        lines: '46-61',
        note: 'Wraps DataTable when enabled',
      },
      {
        path: 'apps/web/src/app/providers/ErrorBoundaryRoot.tsx',
        lines: '15-38',
        note: 'App root safety net',
      },
    ],
  },
  selectiveSubscription: {
    simplestImplementation: `const slice = useSelector(
  (s) => ({ count: s.metrics.count }),
  shallowEqual, // skip re-render if shallow fields unchanged
);`,
    codeReferences: [
      {
        path: 'apps/web/src/features/concepts/components/ConceptControlBento.tsx',
        lines: '142-153',
        note: 'Narrow selector + shallowEqual',
      },
    ],
  },
  autoRetry: {
    simplestImplementation: `import { retry, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = retry(fetchBaseQuery({ baseUrl: '/api' }), {
  maxRetries: 2,
});`,
    codeReferences: [
      {
        path: 'apps/web/src/store/api/baseApi.ts',
        lines: '30-58',
        note: 'Conditional retry wrapper reads concept toggle',
      },
      {
        path: 'apps/web/src/features/explorer/components/DataTable/DataTable.tsx',
        lines: '324-350',
        note: 'Inline error only when rows already loaded',
      },
    ],
  },
};
