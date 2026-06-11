import type { AnalyticsWorkerInput, AnalyticsWorkerOutput } from './analytics.worker';
import type { HighlightWorkerInput, HighlightWorkerOutput, SearchWorkerInput, SearchWorkerOutput } from './search.worker';
import type { SortWorkerInput, SortWorkerOutput } from './sort.worker';

type SearchMessage = SearchWorkerInput | HighlightWorkerInput;
type SearchResponse = SearchWorkerOutput | HighlightWorkerOutput;

function createWorker<TInput, TOutput>(workerUrl: URL) {
  let worker: Worker | null = null;

  const getWorker = () => {
    if (!worker) {
      worker = new Worker(workerUrl, { type: 'module' });
    }
    return worker;
  };

  return (input: TInput): Promise<TOutput> =>
    new Promise((resolve, reject) => {
      const w = getWorker();

      const handler = (event: MessageEvent<TOutput>) => {
        w.removeEventListener('message', handler);
        w.removeEventListener('error', errorHandler);
        resolve(event.data);
      };

      const errorHandler = (event: ErrorEvent) => {
        w.removeEventListener('message', handler);
        w.removeEventListener('error', errorHandler);
        reject(new Error(event.message));
      };

      w.addEventListener('message', handler);
      w.addEventListener('error', errorHandler);
      w.postMessage(input);
    });
}

export const runSearchWorker = createWorker<SearchMessage, SearchResponse>(
  new URL('./search.worker.ts', import.meta.url),
);

export const runSortWorker = createWorker<SortWorkerInput, SortWorkerOutput>(
  new URL('./sort.worker.ts', import.meta.url),
);

export const runAnalyticsWorker = createWorker<AnalyticsWorkerInput, AnalyticsWorkerOutput>(
  new URL('./analytics.worker.ts', import.meta.url),
);

export function terminateWorkers(): void {
  // Workers are lazily created; browser GC handles cleanup on page unload
}
