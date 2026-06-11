export type ConceptId =
  | 'virtualization'
  | 'debouncing'
  | 'abortController'
  | 'reactMemo'
  | 'useCallback'
  | 'useMemo'
  | 'useTransition'
  | 'useDeferredValue'
  | 'throttling'
  | 'codeSplitting'
  | 'suspense'
  | 'webWorkers'
  | 'rtkQueryCache'
  | 'prefetching'
  | 'keepPreviousData'
  | 'infiniteScroll'
  | 'intersectionObserver'
  | 'indexedDB'
  | 'errorBoundary'
  | 'selectiveSubscription'
  | 'autoRetry';

export type ConceptCategory = 'Performance' | 'Network' | 'Architecture' | 'Browser';

export interface ConceptDefinition {
  id: ConceptId;
  name: string;
  category: ConceptCategory;
  shortDescription: string;
  /** Shown in control panel when toggle is ON */
  effectWhenOn: string;
  /** Shown in control panel when toggle is OFF — what you will feel right now */
  effectWhenOff: string;
  whatItIs: string;
  benefit: string;
  withoutIt: string;
  usedIn: string[];
  tryIt: string;
  /** Short steps to trigger this concept in the UI */
  triggerSteps: string[];
}

export const CONCEPT_DEFINITIONS: ConceptDefinition[] = [
  {
    id: 'virtualization',
    name: 'Virtualization',
    category: 'Performance',
    shortDescription: 'Renders only visible table rows in the DOM.',
    effectWhenOn: 'Only ~30 rows exist in DOM — smooth scroll even with lakhs of loaded data.',
    effectWhenOff: 'Every loaded row becomes a DOM node — scroll will stutter and tab may freeze.',
    whatItIs:
      'TanStack Virtual calculates which rows are in the viewport and mounts ~30 DOM nodes regardless of how many records are loaded.',
    benefit:
      'Smooth 60fps scrolling with 50,000+ loaded rows. Memory stays proportional to visible rows, not total data.',
    withoutIt:
      'Every loaded row becomes a DOM node. Scroll stutters, memory spikes, and the tab can freeze with 500+ rows.',
    usedIn: ['Data Explorer table body'],
    tryIt: 'Load several pages via scroll, then disable and scroll again.',
    triggerSteps: [
      'Turn switch ON',
      'Scroll table — load 200+ rows',
      'Turn OFF & scroll — jank + card shows red effect',
    ],
  },
  {
    id: 'debouncing',
    name: 'Debouncing',
    category: 'Network',
    shortDescription: 'Waits 300ms after typing before searching.',
    effectWhenOn: 'One API call per search term — server stays calm while you type.',
    effectWhenOff: 'Each keystroke fires an API call — watch the counter spike as you type.',
    whatItIs:
      'Search input delays the API call until the user pauses typing, batching keystrokes into one request.',
    benefit:
      'One API call per search term instead of one per keystroke. Reduces server load and prevents UI thrashing.',
    withoutIt:
      'Each character triggers an immediate API call. Typing "analytics" fires 9 requests and causes race conditions.',
    usedIn: ['Global search bar'],
    tryIt: 'Type quickly in search and watch the API call counter.',
    triggerSteps: [
      'Turn switch ON',
      'Type fast in search bar (top)',
      'Turn OFF — watch API calls counter jump per key',
    ],
  },
  {
    id: 'abortController',
    name: 'AbortController',
    category: 'Network',
    shortDescription: 'Cancels outdated in-flight search requests.',
    effectWhenOn: 'Stale requests are cancelled — results always match your latest search.',
    effectWhenOff: 'Old slow requests can overwrite new results — data may flicker or show wrong rows.',
    whatItIs:
      'When a new search starts, the previous fetch is aborted so stale responses cannot overwrite fresh results.',
    benefit: 'Correct results always win. No flickering from slow responses arriving after fast ones.',
    withoutIt:
      'Slow requests can resolve after fast ones, showing wrong data briefly. Wasted bandwidth on obsolete queries.',
    usedIn: ['Search debounce pipeline', 'RTK Query base API'],
    tryIt: 'Type fast with debouncing off to see overlapping requests.',
    triggerSteps: [
      'Turn ON + turn Debouncing OFF',
      'Type quickly in search',
      'Card highlights — stale requests get cancelled',
    ],
  },
  {
    id: 'reactMemo',
    name: 'React.memo',
    category: 'Performance',
    shortDescription: 'Skips re-rendering unchanged table cells and headers.',
    effectWhenOn: 'Cells skip redundant renders — lower CPU usage while scrolling.',
    effectWhenOff: 'Every scroll re-renders all visible cells — render count climbs fast.',
    whatItIs:
      'Memoized components only re-render when their props change. Search highlights and headers skip redundant work during scroll.',
    benefit: 'Fewer React reconciliations during scroll and filter changes. Lower CPU usage on large tables.',
    withoutIt:
      'Every scroll or parent state change re-renders all visible cells. CPU usage climbs and FPS drops.',
    usedIn: ['SearchHighlight', 'DataTableHeader', 'TableRow'],
    tryIt: 'Scroll the table and compare render counts in the control panel.',
    triggerSteps: [
      'Turn switch ON',
      'Scroll table — note Renders count',
      'Turn OFF & scroll — renders climb faster',
    ],
  },
  {
    id: 'useCallback',
    name: 'useCallback',
    category: 'Performance',
    shortDescription: 'Keeps stable function references between renders.',
    effectWhenOn: 'Row handlers stay stable — memoized children skip unnecessary updates.',
    effectWhenOff: 'New function every render — child rows re-render even when data unchanged.',
    whatItIs:
      'useCallback returns the same function reference unless dependencies change, so memoized children do not re-render from prop identity changes alone.',
    benefit: 'Stable callbacks for virtualized rows reduce wasted reconciliations during scroll and selection.',
    withoutIt:
      'Inline handlers recreate on every parent render, breaking memo comparisons and increasing render count.',
    usedIn: ['DataTable row toggle', 'sort handlers'],
    tryIt: 'Scroll with useCallback off — render counter climbs faster.',
    triggerSteps: [
      'Turn switch ON',
      'Select rows + scroll table',
      'Turn OFF — same actions, higher render count',
    ],
  },
  {
    id: 'useMemo',
    name: 'useMemo',
    category: 'Performance',
    shortDescription: 'Caches expensive derived values between renders.',
    effectWhenOn: 'Column layout and header config computed once per dependency change.',
    effectWhenOff: 'Grid layout recalculated every render — extra CPU on each scroll frame.',
    whatItIs:
      'useMemo stores the result of expensive calculations and only recomputes when inputs change.',
    benefit: 'Avoids redundant string building and array mapping on every render cycle.',
    withoutIt:
      'Derived values recompute on every render even when inputs are unchanged — wasted CPU.',
    usedIn: ['DataTable gridTemplateColumns', 'headerColumns'],
    tryIt: 'Scroll rapidly with useMemo off and watch render count.',
    triggerSteps: [
      'Turn switch ON',
      'Scroll & resize columns',
      'Turn OFF — scroll again, renders spike',
    ],
  },
  {
    id: 'useTransition',
    name: 'useTransition',
    category: 'Performance',
    shortDescription: 'Marks sort/filter updates as non-urgent.',
    effectWhenOn: 'Sort clicks stay responsive — heavy table updates defer without blocking UI.',
    effectWhenOff: 'Sort updates block immediately — UI can feel stiff on large loaded sets.',
    whatItIs:
      'useTransition wraps state updates as transitions so React can keep the UI responsive and show pending state.',
    benefit: 'Perceived responsiveness during heavy table re-sorts and filter applications.',
    withoutIt:
      'Synchronous state updates block the main thread during large reconciliations.',
    usedIn: ['Column sort dispatch'],
    tryIt: 'Sort a column with many rows loaded — compare responsiveness.',
    triggerSteps: [
      'Load many rows via scroll',
      'Turn ON — click column header to sort',
      'Turn OFF — sort feels heavier on big sets',
    ],
  },
  {
    id: 'useDeferredValue',
    name: 'useDeferredValue',
    category: 'Performance',
    shortDescription: 'Defers expensive highlight updates while you search.',
    effectWhenOn: 'Search highlights trail typing slightly — table stays smooth during fast input.',
    effectWhenOff: 'Highlights update on every debounced keystroke — more row work per search change.',
    whatItIs:
      'useDeferredValue lets React treat search highlight updates as lower priority than typing in the input.',
    benefit:
      'Keeps the search box and scroll responsive while large visible tables catch up on highlighting.',
    withoutIt:
      'Every debounced search immediately re-renders visible rows for highlighting — extra CPU during fast typing.',
    usedIn: ['DataTable search highlights'],
    tryIt: 'Type quickly in search with many rows loaded — compare scroll smoothness.',
    triggerSteps: [
      'Load 100+ rows',
      'Turn ON — type in search bar',
      'Highlights lag slightly; table stays smooth',
    ],
  },
  {
    id: 'throttling',
    name: 'Throttling',
    category: 'Performance',
    shortDescription: 'Limits scroll-driven work to once every 200ms.',
    effectWhenOn: 'Scroll events are batched — less main-thread churn while scrolling.',
    effectWhenOff: 'Every scroll tick fires handlers — render/activity counters climb faster.',
    whatItIs:
      'Throttling caps how often scroll handlers run, unlike debouncing which waits for a pause.',
    benefit: 'Smoother scrolling on large tables by avoiding per-frame handler storms.',
    withoutIt:
      'Scroll handlers fire on every pixel moved — wasted work and higher CPU during long scrolls.',
    usedIn: ['DataTable scroll activity'],
    tryIt: 'Scroll the table rapidly and watch render/activity behavior.',
    triggerSteps: [
      'Turn switch ON',
      'Scroll table fast for 3–5 seconds',
      'Card glows — compare with OFF (more pulses)',
    ],
  },
  {
    id: 'codeSplitting',
    name: 'React.lazy',
    category: 'Architecture',
    shortDescription: 'Loads filter panel code only when needed.',
    effectWhenOn: 'Filter panel loads on demand via Suspense — smaller initial bundle.',
    effectWhenOff: 'Filter panel bundled upfront — heavier first paint.',
    whatItIs:
      'React.lazy + Suspense dynamically import components, splitting them into separate JS chunks loaded at runtime.',
    benefit: 'Faster initial load by deferring non-critical UI like the filter drawer.',
    withoutIt:
      'All feature code ships in the main bundle even if the user never opens filters.',
    usedIn: ['FilterPanel dynamic import'],
    tryIt: 'Open filters — lazy mode loads chunk on first open.',
    triggerSteps: [
      'Turn ON',
      'Click Filters in table toolbar',
      'Turn OFF — panel opens without lazy chunk',
    ],
  },
  {
    id: 'suspense',
    name: 'Suspense',
    category: 'Architecture',
    shortDescription: 'Shows a loading state while lazy chunks download.',
    effectWhenOn: 'Filter drawer shows a loading overlay while its chunk loads.',
    effectWhenOff: 'Lazy filter chunk loads silently — no visible pending UI.',
    whatItIs:
      'React Suspense boundaries let you show fallbacks while lazy-loaded components are still downloading.',
    benefit: 'Clear feedback during code-split loads instead of a blank or frozen drawer.',
    withoutIt:
      'Users get no signal that code is loading — the UI can feel stuck on slow networks.',
    usedIn: ['FilterPanel Suspense fallback'],
    tryIt: 'Open filters with React.lazy on — toggle Suspense to see the loading overlay.',
    triggerSteps: [
      'Turn ON + React.lazy ON',
      'Open Filters (first time)',
      'See loading overlay while chunk downloads',
    ],
  },
  {
    id: 'webWorkers',
    name: 'Web Workers',
    category: 'Browser',
    shortDescription: 'Runs search parsing off the main UI thread.',
    effectWhenOn: 'Search parsing runs in background — input stays responsive.',
    effectWhenOff: 'Search blocks the main thread — typing feels laggy on longer queries.',
    whatItIs:
      'Highlight term extraction runs in a background worker thread via postMessage, keeping the UI thread free.',
    benefit: 'Main thread stays responsive during search processing. No input lag on complex queries.',
    withoutIt:
      'Search processing blocks the main thread. Input feels sluggish; animations and scroll can hitch.',
    usedIn: ['search.worker.ts', 'analytics.worker.ts'],
    tryIt: 'Type in search with workers off — notice input lag on longer queries.',
    triggerSteps: [
      'Turn switch ON',
      'Type a long query in search',
      'Turn OFF — input feels stickier',
    ],
  },
  {
    id: 'rtkQueryCache',
    name: 'RTK Query Cache',
    category: 'Architecture',
    shortDescription: 'Stores API responses and deduplicates requests.',
    effectWhenOn: 'Revisiting same filters is instant — no redundant network calls.',
    effectWhenOff: 'Every tab switch refetches from scratch — API hammered repeatedly.',
    whatItIs:
      'RTK Query keeps paginated results in memory, merges infinite scroll pages, and serves cached data instantly on revisit.',
    benefit:
      'Instant back-navigation. No redundant network for same filters/sort.',
    withoutIt:
      'Every navigation refetches from scratch. Switching datasets or revisiting filters hammers the API repeatedly.',
    usedIn: ['useInfiniteData', 'dataApi endpoints'],
    tryIt: 'Switch datasets back and forth — cached mode is instant, disabled mode refetches.',
    triggerSteps: [
      'Turn ON — load Users tab',
      'Switch to Orders, then back to Users',
      'Turn OFF — same switch = refetch every time',
    ],
  },
  {
    id: 'prefetching',
    name: 'Prefetching',
    category: 'Network',
    shortDescription: 'Loads the next page before you reach the bottom.',
    effectWhenOn: 'Next page warms in cache — scrolling to the end feels instant.',
    effectWhenOff: 'Pages fetch only when requested — more waiting at the bottom.',
    whatItIs:
      'RTK Query prefetch fires the next cursor request in the background while you browse current rows.',
    benefit: 'Removes the visible pause when infinite scroll reaches an unloaded page boundary.',
    withoutIt:
      'Every page loads only on demand — you wait at the bottom even on fast networks.',
    usedIn: ['useInfiniteData', 'RTK Query prefetch'],
    tryIt: 'Load a page, pause mid-table, then scroll to the bottom — prefetch makes the next page snappier.',
    triggerSteps: [
      'Turn ON',
      'Scroll to bottom twice (load 2+ pages)',
      'Next page appears faster — card highlights',
    ],
  },
  {
    id: 'keepPreviousData',
    name: 'Keep Previous Data',
    category: 'Architecture',
    shortDescription: 'Shows last rows while a new search or filter loads.',
    effectWhenOn: 'Old rows stay visible during refetch — no empty flash between queries.',
    effectWhenOff: 'Table can blank briefly while new results load — jarring context loss.',
    whatItIs:
      'A stale-while-revalidate pattern that holds the previous result set until fresh data arrives.',
    benefit: 'Stable UI during search/filter changes — users keep context instead of staring at spinners.',
    withoutIt:
      'Each query change clears the table until the network responds — flicker and layout shift.',
    usedIn: ['useInfiniteData result shaping'],
    tryIt: 'Change search terms quickly — compare whether old rows linger during fetch.',
    triggerSteps: [
      'Turn ON',
      'Search something, then change query fast',
      'Old rows stay until new data arrives',
    ],
  },
  {
    id: 'infiniteScroll',
    name: 'Infinite Scroll',
    category: 'Performance',
    shortDescription: 'Auto-loads next page when you scroll near the bottom.',
    effectWhenOn: 'Scroll to bottom — next page loads automatically.',
    effectWhenOff: 'You must click "Load more" manually — easy to miss data at the bottom.',
    whatItIs:
      'A sentinel at the table bottom triggers fetchNextPage automatically when infinite scroll is enabled.',
    benefit: 'Continuous browsing without pagination clicks. Natural enterprise data exploration UX.',
    withoutIt:
      'You must click "Load More" manually. Easy to miss data; worse flow for large dataset exploration.',
    usedIn: ['DataTable scroll container'],
    tryIt: 'Scroll to the bottom — auto-load vs manual button.',
    triggerSteps: [
      'Turn ON',
      'Scroll table to the very bottom',
      'Row count increases — no Load more button',
    ],
  },
  {
    id: 'intersectionObserver',
    name: 'IntersectionObserver',
    category: 'Browser',
    shortDescription: 'Detects when the load-more sentinel enters view.',
    effectWhenOn: 'Native observer API triggers pagination — efficient and decoupled from scroll events.',
    effectWhenOff: 'Scroll position math replaces the observer — more manual work on every scroll tick.',
    whatItIs:
      'IntersectionObserver watches a sentinel element and fires when it nears the viewport, without polling scroll.',
    benefit: 'Cheaper than scroll listeners for infinite lists — browser optimizes visibility checks.',
    withoutIt:
      'Load-more detection runs via scroll handlers and getBoundingClientRect on every move.',
    usedIn: ['useIntersectionLoadMore hook'],
    tryIt: 'Scroll to the bottom with infinite scroll on — compare observer vs scroll fallback.',
    triggerSteps: [
      'Infinite Scroll must be ON',
      'Turn this ON — scroll to bottom',
      'Turn OFF — same scroll uses fallback math',
    ],
  },
  {
    id: 'indexedDB',
    name: 'IndexedDB',
    category: 'Browser',
    shortDescription: 'Persists search history and preferences locally.',
    effectWhenOn: 'Search history and preferences survive page refresh.',
    effectWhenOff: 'History and preferences reset on every reload — nothing persists locally.',
    whatItIs:
      'Dexie wraps IndexedDB to store search history, saved filters, visited pages, and user preferences across sessions.',
    benefit: 'Search history survives refresh. Preferences restore automatically. No server round-trip needed.',
    withoutIt:
      'Search history and preferences reset on every page load. Saved filters are lost between sessions.',
    usedIn: ['Search history dropdown', 'Settings persistence'],
    tryIt: 'Search something, refresh — history appears only when IndexedDB is on.',
    triggerSteps: [
      'Turn switch ON',
      'Search, then click search bar again',
      'Past searches show — refresh page to persist',
    ],
  },
  {
    id: 'errorBoundary',
    name: 'Error Boundary',
    category: 'Architecture',
    shortDescription: 'Isolates table crashes from the rest of the app.',
    effectWhenOn: 'Table errors show a local recovery UI — header and control panel keep working.',
    effectWhenOff: 'Table errors bubble to the root boundary — the whole shell may reset.',
    whatItIs:
      'A React error boundary catches render errors in its subtree and renders a fallback instead of crashing the page.',
    benefit: 'Fault isolation for data-heavy UI — one bad row does not white-screen the explorer.',
    withoutIt:
      'Uncaught render errors take down the entire React tree above the failure point.',
    usedIn: ['Explorer table section'],
    tryIt: 'Toggle off to see how errors would propagate without a feature-level boundary.',
    triggerSteps: [
      'Keep ON (default)',
      'If table throws, only table shows error UI',
      'Turn OFF — errors bubble to full app shell',
    ],
  },
  {
    id: 'selectiveSubscription',
    name: 'Selective Subscription',
    category: 'Performance',
    shortDescription: 'Re-renders control panel only when metrics change.',
    effectWhenOn: 'Shallow selector — panel skips re-renders from highlight-only state churn.',
    effectWhenOff: 'Whole conceptControls slice subscribed — more panel re-renders during activity pulses.',
    whatItIs:
      'useSelector with shallow equality subscribes to a narrow slice of Redux state instead of the entire store branch.',
    benefit: 'Fewer wasted re-renders in dense dashboards when unrelated state fields change.',
    withoutIt:
      'Components re-render whenever any field in a broad state object changes — including highlight pulses.',
    usedIn: ['ConceptControlBento metrics'],
    tryIt: 'Scroll the table and watch whether the control panel flickers more with this off.',
    triggerSteps: [
      'Turn ON',
      'Scroll table — watch concept card glows',
      'Turn OFF — control panel re-renders more often',
    ],
  },
  {
    id: 'autoRetry',
    name: 'Auto Retry',
    category: 'Network',
    shortDescription: 'Retries failed API calls with exponential backoff.',
    effectWhenOn: 'Transient network errors retry up to 2 times — fewer random Retry flashes.',
    effectWhenOff: 'First failed fetch shows error immediately — manual Retry required.',
    whatItIs:
      'RTK Query retry wrapper re-issues failed requests with exponential backoff before surfacing an error to the UI.',
    benefit:
      'Handles flaky Wi‑Fi, brief API hiccups, and tab refocus refetches without wiping the table.',
    withoutIt:
      'A single failed page fetch can flash a full-table error even when thousands of rows are already loaded.',
    usedIn: ['baseApi baseQuery', 'Infinite scroll pagination'],
    tryIt: 'Turn OFF and throttle network in DevTools — see immediate errors vs silent retries when ON.',
    triggerSteps: [
      'Keep ON (default)',
      'Scroll fast or switch tabs — failed pages retry automatically',
      'Turn OFF — same failure shows Retry banner immediately',
    ],
  },
];

export const DEFAULT_CONCEPT_STATE: Record<ConceptId, boolean> = {
  virtualization: true,
  debouncing: true,
  abortController: true,
  reactMemo: true,
  useCallback: true,
  useMemo: true,
  useTransition: true,
  useDeferredValue: true,
  throttling: true,
  codeSplitting: true,
  suspense: true,
  webWorkers: true,
  rtkQueryCache: true,
  prefetching: true,
  keepPreviousData: true,
  infiniteScroll: true,
  intersectionObserver: true,
  indexedDB: true,
  errorBoundary: true,
  selectiveSubscription: true,
  autoRetry: true,
};

export const PROJECT_PURPOSE = {
  title: 'Massive Dataset Explorer',
  subtitle: 'Enterprise analytics platform engineering showcase',
  description:
    'This is not a toy CRUD app. It demonstrates how senior frontend teams build data platforms that handle 10 lakh (1,000,000) records with production patterns: virtualization, intelligent caching, off-main-thread work, and observable performance.',
  audience:
    'Built for engineers evaluating React architecture, performance tradeoffs, and scalable state management at enterprise scale.',
  datasets: '2.7L users · 3.6L orders · 3.6L transactions',
};
